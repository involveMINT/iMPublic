import {
  CreditRepository,
  HandleRepository,
  TransactionRepository,
  VoucherRepository,
} from '@involvemint/server/core/domain-services';
import {
  calculateTotalCreditsAmount,
  Credit,
  environment,
  FrontendRoutes,
  FRONTEND_ROUTES_TOKEN,
  GetTransactionsForProfileDto,
  ImConfig,
  IM_ACTIVE_PROFILE_QUERY_PARAM,
  RedeemVoucherDto,
  Transaction,
  transactionAmountExceedsEpBudget,
  TransactionDto,
  createQuery,
  IParser,
  Query
} from '@involvemint/shared/domain';
import { guaranteeSixCharUidUniqueness, isDecimal, parseDate, UnArray } from '@involvemint/shared/util';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compareAsc } from 'date-fns';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';

export const CreditQuery = createQuery<Credit>()({
  id: true,
  escrow: true,
  amount: true,
  dateMinted: true,
  changeMaker: { id: true },
  exchangePartner: { id: true },
  servePartner: { id: true },
  poi: { id: true },
});

export type CreditStoreModel = IParser<Credit, typeof CreditQuery>;

@Injectable()
export class TransactionService {
  constructor(
    private readonly auth: AuthService,
    private readonly transactionRepo: TransactionRepository,
    private readonly voucherRepo: VoucherRepository,
    private readonly creditRepo: CreditRepository,
    private readonly handleRepo: HandleRepository,
    private readonly dbTransaction: DbTransactionCreator,
    private readonly email: EmailService,
    private readonly sms: SMSService,
    @Inject(FRONTEND_ROUTES_TOKEN) private readonly route: FrontendRoutes
  ) {}

  async getForProfile(query: Query<Transaction>, token: string, dto: GetTransactionsForProfileDto) {
    await this.auth.authenticateFromProfileId(dto.profileId, token);
    return this.transactionRepo.query(query, {
      where: [
        { receiverChangeMaker: dto.profileId },
        { receiverExchangePartner: dto.profileId },
        { receiverServePartner: dto.profileId },
        { senderChangeMaker: dto.profileId },
        { senderExchangePartner: dto.profileId },
        { senderServePartner: dto.profileId },
      ],
    });
  }

  /**
   *
   * @param query
   * @param token user that is sending credits to whoever
   * @param dto
   */
  async transactionP2p(
    query: Query<Transaction>,
    token: string,
    dto: TransactionDto,
    runInTransaction: boolean
  ) {
    await this.auth.authenticateFromUserHandle(dto.senderHandle, token);
    return this.transaction(query, dto, runInTransaction);
  }

  /**
   * Credits are transferred from one party to another by reassigning ownership of one or many credits to
   * the receiving party.
   *
   * Ex. John transfers 2 Credits to Lucy.
   *
   * Before transaction:
   *
   * Credit 1: Amount: 2, Owner: John, POI: 1
   *
   * After transaction:
   *
   * Credit 1: Amount: 2, Owner: Lucy, POI: 1
   *
   * If the receiving party has credits that have the same POI as the ones they are about to receive,
   * those credits become merged into a single database table row with the amount summed.
   *
   * Ex. John transfers 2 Credits to Lucy.
   *
   * Before transaction:
   *
   * Credit 1: Amount: 2, Owner: John, POI: 1
   * Credit 2: Amount: 4, Owner: Lucy, POI: 1
   *
   * After transaction:
   *
   * Credit 2: Amount: 6, Owner: Lucy, POI: 1
   *
   * If the amount of the transaction is less than the senders credit amount,
   * the difference is split between John and Lucy based on POI.
   *
   * Ex. John transfers 2 Credits to Lucy.
   *
   * Before transaction:
   *
   * Credit 1: Amount: 3, Owner: John, POI: 1
   * Credit 2: Amount: 5, Owner: John, POI: 2
   *
   * After transaction:
   *
   * Credit 1: Amount: 2, Owner: Lucy, POI: 1
   * Credit 2: Amount: 1, Owner: John, POI: 1
   * Credit 3: Amount: 5, Owner: John, POI: 2
   *
   * If Lucy then sends 1 credit back to John, the credits merge by POI.
   *
   * Before transaction:
   *
   * Credit 1: Amount: 2, Owner: Lucy, POI: 1
   * Credit 2: Amount: 1, Owner: John, POI: 1
   * Credit 3: Amount: 5, Owner: John, POI: 2
   *
   * After transaction:
   *
   * Credit 1: Amount: 1, Owner: Lucy, POI: 1
   * Credit 3: Amount: 2, Owner: John, POI: 1
   * Credit 4: Amount: 5, Owner: John, POI: 2
   * @param query
   * @param token seller or EP that is redeeming the voucher
   * @param dto
   */
  async transactionVoucher(
    query: Query<Transaction>,
    token: string,
    dto: RedeemVoucherDto,
    runInTransaction: boolean
  ) {
    const seller = await this.auth.authenticateFromProfileId(dto.sellerId, token);
    const voucher = await this.voucherRepo.query(
      {
        amount: true,
        changeMakerReceiver: { handle: { id: true } },
        exchangePartnerReceiver: { handle: { id: true } },
        servePartnerReceiver: { handle: { id: true } },
      },
      {
        where: [{ servePartnerReceiver: dto.sellerId }, { code: dto.code }],
      }
    );

    if (voucher.length !== 1) {
      throw new BadRequestException('Multiple vouchers found.');
    }

    const voucherReceiver =
      voucher[0].changeMakerReceiver?.handle.id ||
      voucher[0].exchangePartnerReceiver?.handle.id ||
      voucher[0].servePartnerReceiver?.handle.id;

    if (!voucherReceiver) {
      throw new BadRequestException('Transaction sender not found!');
    }

    const transactionDto: TransactionDto = {
      senderHandle: voucherReceiver,
      receiverHandle: seller.handleId,
      amount: voucher[0].amount,
      memo: 'Voucher',
    };
    return this.transaction(query, transactionDto, runInTransaction);
  }

  private async transaction(query: Query<Transaction>, dto: TransactionDto, runInTransaction: boolean) {
    const getCredits = async (
      cmId: string | undefined,
      epId: string | undefined,
      spId: string | undefined
    ): Promise<CreditStoreModel[]> =>
      (
        await this.creditRepo.query(CreditQuery, {
          where: [
            { changeMaker: { id: cmId } },
            { exchangePartner: { id: epId } },
            { servePartner: { id: spId } },
          ],
        })
      )
        .filter((c) => !c.escrow)
        .sort((a, b) => compareAsc(parseDate(a.dateMinted), parseDate(b.dateMinted)));

    /*
        _     ___      _             
       / |   / __| ___| |_ _  _ _ __ 
       | |_  \__ \/ -_)  _| || | '_ \
       |_(_) |___/\___|\__|\_,_| .__/
                               |_|   
    */

    // Sender setup.
    const sender = await this.handleRepo.findOneOrFail(dto.senderHandle, {
      changeMaker: { id: true, firstName: true, lastName: true },
      exchangePartner: {
        id: true,
        name: true,
      },
      servePartner: { id: true, name: true },
    });
    const senderCredits: CreditStoreModel[] = await getCredits(
      sender.changeMaker?.id,
      sender.exchangePartner?.id,
      sender.servePartner?.id
    );
    const sendersTotalAmount = calculateTotalCreditsAmount(senderCredits);

    // Receiver setup.
    const receiver = await this.handleRepo.findOneOrFail(dto.receiverHandle, {
      changeMaker: { id: true, firstName: true, lastName: true, user: { id: true }, phone: true },
      exchangePartner: {
        id: true,
        view: { receivedThisMonth: true },
        budget: true,
        admins: { user: { id: true } },
        name: true,
        phone: true,
      },
      servePartner: { id: true, name: true, admins: { user: { id: true } }, phone: true },
    });
    const receiverCredits: CreditStoreModel[] = await getCredits(
      receiver.changeMaker?.id,
      receiver.exchangePartner?.id,
      receiver.servePartner?.id
    );

    /*
        ___      ___ _           _       
       |_  )    / __| |_  ___ __| |__ ___
        / / _  | (__| ' \/ -_) _| / /(_-<
       /___(_)  \___|_||_\___\__|_\_\/__/
                                         
    */

    if (dto.senderHandle === dto.receiverHandle) {
      throw new HttpException('Cannot conduct a transaction with yourself.', HttpStatus.BAD_REQUEST);
    }
    if (dto.amount === 0 || isDecimal(dto.amount)) {
      throw new HttpException('Amount must be an non-zero integer.', HttpStatus.BAD_REQUEST);
    }
    if (dto.amount > ImConfig.maxCreditTransactionAmount) {
      throw new HttpException(
        'CommunityCredits amount exceeds maximum transaction amount.',
        HttpStatus.BAD_REQUEST
      );
    }
    if (sendersTotalAmount < dto.amount) {
      throw new HttpException('Insufficient credits to fulfill transaction.', HttpStatus.BAD_REQUEST);
    }
    if (receiver.exchangePartner) {
      if (!receiver.exchangePartner.budget) {
        throw new HttpException(
          `ExchangePartner @${dto.receiverHandle}'s monthly budget is not set. Transaction invalidated.`,
          HttpStatus.CONFLICT
        );
      }
      if (transactionAmountExceedsEpBudget(receiver.exchangePartner, dto.amount)) {
        await this.email.sendInfoEmail({
          email: receiver.exchangePartner.admins.map((a) => a.user.id),
          subject: 'You missed a sale!',
          user: receiver.exchangePartner.name,
          message: `You missed a sale from @${dto.senderHandle} creating impact in the local economy.
                    Increase your budget to support stewardship and increase impact in the community.
                    Go here to edit your budget: ${environment.appUrl}${this.route.path.ep.budget.ROOT}`,
        });
        throw new HttpException(
          `Transaction amount exceeds ExchangePartner @${dto.receiverHandle}'s monthly budget. Transaction invalidated.`,
          HttpStatus.CONFLICT
        );
      }
    }

    /*
        ____    _              _
       |__ /   | |   ___  __ _(_)__
        |_ \_  | |__/ _ \/ _` | / _|
       |___(_) |____\___/\__, |_\__|
                         |___/
    */

    /** Amount transferred currently in queue. */
    let amountTransferred = 0;

    /** Sender's update queue for Credits to be updated in DB. */
    const senderQueue: CreditStoreModel[] = [];

    /** Receiver's update queue for Credits to be updated in DB. */
    const receiverQueue: CreditStoreModel[] = [];

    for (const credit of senderCredits) {
      /** Amount left to transfer (amount that still needs to be placed in `queue`). */
      const amountLeft = dto.amount - amountTransferred;

      // If sender's current credit's amount is <= `amountLeft` then transfer that credit to receiver.
      if (credit.amount <= amountLeft) {
        amountTransferred += credit.amount;
        receiverQueue.push({
          ...credit,
          changeMaker: receiver.changeMaker ?? null,
          exchangePartner: receiver.exchangePartner ?? null,
          servePartner: receiver.servePartner ?? null,
        });

        // Break loop if enough credits in the queue; we're done here.
        if (amountTransferred === dto.amount) {
          break;
        }
      } else {
        // If the sender's current credit is greater than `amountLeft`,
        // then split difference with the creation of new credit (owned by the receiver)
        // and the sender's current credit.
        const splitCredit: UnArray<typeof receiverCredits> = {
          ...credit,
          id: uuid.v4(),
          amount: amountLeft,
          changeMaker: receiver.changeMaker ?? null,
          exchangePartner: receiver.exchangePartner ?? null,
          servePartner: receiver.servePartner ?? null,
        };

        // Give new credit to receiver
        receiverQueue.push(splitCredit);

        // Update sender's current credit with the amount as the difference split.
        senderQueue.push({ ...credit, amount: credit.amount - amountLeft });

        // Loop will always break here since the difference is split between sender and receiver.
        break;
      }
    }

    // Add all receiver credits to their queue to do any potential POI merges
    receiverQueue.push(...receiverCredits);

    /*
        _ _     __  __                    ___     _ 
       | | |   |  \/  |___ _ _ __ _ ___  | _ \___(_)
       |_  _|  | |\/| / -_) '_/ _` / -_) |  _/ _ \ |
         |_(_) |_|  |_\___|_| \__, \___| |_| \___/_|
                              |___/                 
    */

    // Merge any CommunityCredits that have the same PoI (if any)
    const { merged: receiverMerged, remove: receiverRemove } = this.mergeCreditsByPoi(receiverQueue);

    // TODO: Find POI commonalities between senders and receivers credits to make POI merging efficient.

    /*
        ___      ___                 _ _   
       | __|    / __|___ _ __  _ __ (_) |_ 
       |__ \_  | (__/ _ \ '  \| '  \| |  _|
       |___(_)  \___\___/_|_|_|_|_|_|_|\__|
                                           
    */

    let epAudibleCode: string | null = null;
    if (receiver.exchangePartner) {
      const epT = await this.transactionRepo.query(
        { epAudibleCode: true },
        { where: { receiverExchangePartner: receiver.exchangePartner.id } }
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const epTCodes = epT.filter((t) => t.epAudibleCode).map((t) => t.epAudibleCode!);
      epAudibleCode = guaranteeSixCharUidUniqueness(epTCodes);
    }

    const commit = async () => {
      await this.transactionRepo.upsert({
        id: transactionId,
        dateTransacted,
        amount: dto.amount,
        memo: dto.memo,
        receiverChangeMaker: receiver.changeMaker?.id ?? null,
        receiverExchangePartner: receiver.exchangePartner?.id ?? null,
        receiverServePartner: receiver.servePartner?.id ?? null,
        senderChangeMaker: sender.changeMaker?.id ?? null,
        senderExchangePartner: sender.exchangePartner?.id ?? null,
        senderServePartner: sender.servePartner?.id ?? null,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        epAudibleCode: epAudibleCode!,
      });
      await this.creditRepo.upsertMany([...senderQueue, ...receiverMerged]);
      await this.creditRepo.deleteMany(receiverRemove.map((c) => c.id));
    };

    const transactionId = uuid.v4();
    const dateTransacted = new Date();

    if (runInTransaction) {
      await this.dbTransaction.run(() => commit());
    } else {
      await commit();
    }

    /*
         __     _  _     _   _  __ _         _   _             
        / /    | \| |___| |_(_)/ _(_)__ __ _| |_(_)___ _ _  ___
       / _ \_  | .` / _ \  _| |  _| / _/ _` |  _| / _ \ ' \(_-<
       \___(_) |_|\_\___/\__|_|_| |_\__\__,_|\__|_\___/_||_/__/
                                                               
    */

    const senderName = (
      sender.changeMaker
        ? `${sender.changeMaker.firstName} ${sender.changeMaker.lastName}`
        : sender.exchangePartner?.name ?? sender.servePartner?.name
    ) as string;
    const subject = `You've received Community Currency!`;
    const message = (receiverId: string) =>
      `You have received ${dto.amount / 100} Community Currency from ${senderName} (@${dto.senderHandle})!
      <br/><br/>
      This transaction was processed on ${dateTransacted.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })} EST.
      <br/><br/>
      Click here to view: ${environment.appUrl}${
        this.route.path.wallet.ROOT
      }?${IM_ACTIVE_PROFILE_QUERY_PARAM}=${receiverId}`;

    if (receiver.changeMaker) {
      await this.email.sendInfoEmail({
        subject,
        message: message(receiver.changeMaker.id),
        email: receiver.changeMaker.user.id,
      });
      if (receiver.changeMaker.phone) {
        await this.sms.sendInfoSMS({
          message: message(receiver.changeMaker.id).replace(/<br\/>/g, ''),
          phone: receiver.changeMaker.phone,
        });
      }
    } else if (receiver.exchangePartner) {
      await this.email.sendInfoEmail({
        subject,
        message: message(receiver.exchangePartner.id),
        email: receiver.exchangePartner.admins.map((a) => a.user.id),
      });
      if (receiver.exchangePartner.phone) {
        await this.sms.sendInfoSMS({
          message: message(receiver.exchangePartner.id).replace(/<br\/>/g, ''),
          phone: receiver.exchangePartner.phone,
        });
      }
    } else if (receiver.servePartner) {
      await this.email.sendInfoEmail({
        subject,
        message: message(receiver.servePartner.id),
        email: receiver.servePartner.admins.map((a) => a.user.id),
      });
      if (receiver.servePartner.phone) {
        await this.sms.sendInfoSMS({
          message: message(receiver.servePartner.id).replace(/<br\/>/g, ''),
          phone: receiver.servePartner.phone,
        });
      }
    }

    return this.transactionRepo.findOneOrFail(transactionId, query);
  }

  /**
   * Merges any credits owned by one owner based on PoI.
   * If two or more credits have the same PoI ID, then merge those credits together.
   * @param credits credits by own owner prior to transaction
   */
  private mergeCreditsByPoi(credits: CreditStoreModel[]): {
    merged: CreditStoreModel[];
    remove: CreditStoreModel[];
  } {
    if (credits.length === 0) {
      return { merged: [], remove: [] };
    }

    if (credits.length === 1) {
      return { merged: credits, remove: [] };
    }

    const matchedCreditsToPoiId = new Map<string, CreditStoreModel[]>();
    const merged: CreditStoreModel[] = [];
    const remove: CreditStoreModel[] = [];

    for (const credit of credits) {
      const poiId = credit.poi?.id;
      if (poiId) {
        if (matchedCreditsToPoiId.has(poiId)) {
          const c = matchedCreditsToPoiId.get(poiId);
          matchedCreditsToPoiId.set(poiId, c ? [...c, credit] : [credit]);
        } else {
          matchedCreditsToPoiId.set(poiId, [credit]);
        }
      } else {
        // If there is no POI for this credit, then it definitely just gets merged
        merged.push(credit);
      }
    }

    for (const [, poiCredits] of matchedCreditsToPoiId) {
      // If the length of poiCredits is <= 1 then there are no duplicates for that PoS
      if (poiCredits.length <= 1) {
        merged.push(...poiCredits);
        continue;
      }

      const mergedAmount = calculateTotalCreditsAmount(poiCredits);

      const mergedCredit: CreditStoreModel = {
        ...poiCredits[0], // poiCredits will have same data except id and amount
        id: uuid.v4(),
        amount: mergedAmount,
      };

      remove.push(...poiCredits); // remove all duplicate credits
      merged.push(mergedCredit); // consolidate them into one
    }

    return { merged, remove };
  }
}
