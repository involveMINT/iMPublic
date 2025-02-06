import {
  ExchangePartnerRepository,
  OfferRepository,
  VoucherRepository,
} from '@involvemint/server/core/domain-services';
import {
  ArchiveVoucherDto,
  BuyVoucherDto,
  calculateVoucherExpirationDate,
  calculateVoucherStatus,
  environment,
  FrontendRoutes,
  FRONTEND_ROUTES_TOKEN,
  GetVouchersBySellerDto,
  GetVouchersForProfileDto,
  RedeemVoucherDto,
  RefundVoucherDto,
  transactionAmountExceedsEpBudget,
  UnarchiveVoucherDto,
  Voucher,
  voucherCanBeRedeemed,
  voucherCanBeRefunded,
  Query
} from '@involvemint/shared/domain';
import { guaranteeSixCharUidUniqueness } from '@involvemint/shared/util';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { CreditService } from '../credit/credit.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepo: VoucherRepository,
    private readonly auth: AuthService,
    private readonly credit: CreditService,
    private readonly offer: OfferRepository,
    private readonly transactionService: TransactionService,
    private readonly dbTransaction: DbTransactionCreator,
    private readonly epRepo: ExchangePartnerRepository,
    private readonly email: EmailService,
    @Inject(FRONTEND_ROUTES_TOKEN) private readonly route: FrontendRoutes,
    private readonly sms: SMSService
  ) {}

  async getForProfile(query: Query<Voucher>, token: string, dto: GetVouchersForProfileDto) {
    await this.auth.authenticateFromProfileId(dto.profileId, token);
    return this.voucherRepo.query(query, {
      where: [
        { changeMakerReceiver: dto.profileId },
        { servePartnerReceiver: dto.profileId },
        { exchangePartnerReceiver: dto.profileId },
      ],
    });
  }

  async getBySeller(query: Query<Voucher>, token: string, dto: GetVouchersBySellerDto) {
    await this.auth.authenticateFromProfileId(dto.epId, token);
    return this.voucherRepo.query(query, { where: { seller: dto.epId } });
  }

  async buy(query: Query<Voucher>, token: string, dto: BuyVoucherDto) {
    const buyer = await this.auth.authenticateFromProfileId(dto.buyerId, token);

    if (dto.buyerId === dto.sellerId) {
      throw new HttpException('Cannot buy a voucher from yourself.', HttpStatus.BAD_REQUEST);
    }

    if (dto.offers.length < 1) {
      throw new HttpException(
        `At least one offer must be linked to purchase a Voucher. Transaction invalidated.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const offerIds = dto.offers.map((offer) => offer.offerId);
    const offers = await this.offer.findMany(offerIds);
    let amount = 0;
    offers.forEach((offer) => {
      amount += offer.price * (dto.offers.find((o) => o.offerId === offer.id)?.quantity ?? 1);
    });

    const seller = await this.epRepo.findOneOrFail(dto.sellerId, {
      budget: true,
      handle: { id: true },
      view: { receivedThisMonth: true },
      name: true,
      admins: { user: { id: true } },
      phone: true,
    });

    if (transactionAmountExceedsEpBudget(seller, amount)) {
      throw new HttpException(
        `Transaction amount exceeds ExchangePartner @${seller.handle.id}'s monthly budget.
         Transaction invalidated.`,
        HttpStatus.CONFLICT
      );
    }

    const vouchers = await this.voucherRepo.query(
      { code: true },
      { where: { servePartnerReceiver: dto.sellerId } }
    );
    const code = guaranteeSixCharUidUniqueness(vouchers.map((v) => v.code));

    const voucherId = uuid.v4();
    const now = new Date();
    await this.dbTransaction.run(async () => {
      await this.credit.transferCreditsInToEscrow(dto.buyerId, amount);
      await this.voucherRepo.upsert({
        id: voucherId,
        amount,
        code,
        dateCreated: now,
        dateExpires: calculateVoucherExpirationDate(now),
        offers: dto.offers.map((offer) => ({
          id: uuid.v4(),
          offer: offer.offerId,
          quantity: offer.quantity,
          voucher: voucherId,
        })),
        seller: dto.sellerId,
        changeMakerReceiver: buyer.changeMaker ?? null,
        exchangePartnerReceiver: buyer.exchangePartner ?? null,
        servePartnerReceiver: buyer.servePartner ?? null,
      });
    });

    const message = `@${buyer.handleId} bought a ${
      amount / 100
    } Credit voucher from your ExchangePartner account: ${seller.name}. Click here to view: ${
      environment.appUrl
    }${this.route.path.ep.vouchers.ROOT}/${voucherId}`;

    if (seller.phone) {
      await this.sms.sendInfoSMS({ message, phone: seller.phone });
    }

    await this.email.sendInfoEmail({
      message,
      subject: `Someone bought a Voucher!`,
      user: seller.name,
      email: seller.admins.map((a) => a.user.id),
    });

    return this.voucherRepo.findOneOrFail(voucherId, query);
  }

  async redeemVoucher(query: Query<Voucher>, token: string, dto: RedeemVoucherDto) {
    await this.auth.authenticateFromProfileId(dto.sellerId, token);

    const vouchers = await this.voucherRepo.query(
      {
        id: true,
        code: true,
        dateRedeemed: true,
        dateRefunded: true,
        dateExpires: true,
        amount: true,
        seller: { name: true },
        changeMakerReceiver: { id: true, handle: { id: true }, user: { id: true }, phone: true },
        exchangePartnerReceiver: {
          id: true,
          handle: { id: true },
          phone: true,
          admins: { user: { id: true } },
        },
        servePartnerReceiver: {
          id: true,
          handle: { id: true },
          phone: true,
          admins: { user: { id: true } },
        },
      },
      { where: [{ servePartnerReceiver: dto.sellerId }, { code: dto.code }] }
    );

    if (vouchers.length !== 1) {
      throw new HttpException("There's been an error retrieving the voucher.", HttpStatus.BAD_REQUEST);
    }

    const voucher = vouchers[0];
    const status = calculateVoucherStatus(voucher);

    if (!voucherCanBeRedeemed(voucher)) {
      throw new HttpException(
        `Cannot Redeem voucher. A voucher can only be in an active state to be redeemed.
         Current state: ${status}.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const buyerId = (voucher.changeMakerReceiver?.id ||
      voucher.exchangePartnerReceiver?.id ||
      voucher.servePartnerReceiver?.id) as string;

    const buyerHandle = (voucher.changeMakerReceiver?.handle.id ||
      voucher.exchangePartnerReceiver?.handle.id ||
      voucher.servePartnerReceiver?.handle.id) as string;

    const buyerEmails =
      [voucher.changeMakerReceiver?.user.id as string] ||
      voucher.exchangePartnerReceiver?.admins.map((a) => a.user.id) ||
      voucher.servePartnerReceiver?.admins.map((a) => a.user.id);

    const message = `Your ${voucher.amount / 100} TimeCredit Voucher for ${
      voucher.seller.name
    } has been redeemed.`;

    await this.dbTransaction.run(async () => {
      await this.credit.transferCreditsOutOfEscrow(buyerId, voucher.amount);
      await this.transactionService.transactionVoucher({}, token, dto, false);
      await this.voucherRepo.update(voucher.id, { dateRedeemed: new Date() });
    });

    if (buyerEmails) {
      await this.email.sendInfoEmail({
        message,
        subject: `Your Voucher was Redeemed`,
        user: `@${buyerHandle}`,
        email: buyerEmails,
      });
    }

    if (voucher.changeMakerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.changeMakerReceiver.phone,
      });
    }

    if (voucher.servePartnerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.servePartnerReceiver.phone,
      });
    }

    if (voucher.exchangePartnerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.exchangePartnerReceiver.phone,
      });
    }

    return this.voucherRepo.findOneOrFail(voucher.id, query);
  }

  async refundVoucher(query: Query<Voucher>, token: string, dto: RefundVoucherDto) {
    const voucher = await this.voucherRepo.findOneOrFail(dto.voucherId, {
      id: true,
      seller: { id: true, handle: { id: true }, name: true },
      dateRefunded: true,
      dateRedeemed: true,
      dateExpires: true,
      amount: true,
      changeMakerReceiver: { id: true, handle: { id: true }, user: { id: true }, phone: true },
      servePartnerReceiver: {
        id: true,
        handle: { id: true },
        phone: true,
        admins: { user: { id: true } },
      },
      exchangePartnerReceiver: {
        id: true,
        handle: { id: true },
        phone: true,
        admins: { user: { id: true } },
      },
    });

    await this.auth.authenticateFromProfileId(voucher.seller.id, token);

    const status = calculateVoucherStatus(voucher);
    if (!voucherCanBeRefunded(voucher)) {
      throw new HttpException(
        `Cannot Refund voucher. A voucher can only be in an active state or redeemed state to be refunded.
         Current state: ${status}.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const buyerHandle = (voucher.changeMakerReceiver?.handle.id ||
      voucher.servePartnerReceiver?.handle.id ||
      voucher.exchangePartnerReceiver?.handle.id) as string;

    const buyerId = (voucher.changeMakerReceiver?.id ||
      voucher.servePartnerReceiver?.id ||
      voucher.exchangePartnerReceiver?.id) as string;

    const buyerEmails =
      [voucher.changeMakerReceiver?.user.id as string] ||
      voucher.exchangePartnerReceiver?.admins.map((a) => a.user.id) ||
      voucher.servePartnerReceiver?.admins.map((a) => a.user.id);

    if (voucher.dateRedeemed) {
      // If it was redeemed, do a transaction.
      await this.dbTransaction.run(async () => {
        await this.voucherRepo.update(dto.voucherId, { dateRefunded: new Date() });
        await this.transactionService.transactionP2p(
          {},
          token,
          {
            amount: voucher.amount,
            memo: 'Voucher',
            senderHandle: voucher.seller.handle.id,
            receiverHandle: buyerHandle,
          },
          false
        );
      });
    } else {
      // If it was not redeemed, transfer Escrow credits.
      await this.dbTransaction.run(async () => {
        await this.voucherRepo.update(dto.voucherId, { dateRefunded: new Date() });
        await this.credit.transferCreditsOutOfEscrow(buyerId, voucher.amount);
      });
    }

    // Send notifications

    const message = `Your ${voucher.amount / 100} TimeCredit Voucher for ${
      voucher.seller.name
    } has been refunded.`;

    if (buyerEmails) {
      await this.email.sendInfoEmail({
        message,
        subject: `Your Voucher was Refunded`,
        user: `@${buyerHandle}`,
        email: buyerEmails,
      });
    }

    if (voucher.changeMakerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.changeMakerReceiver.phone,
      });
    }

    if (voucher.servePartnerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.servePartnerReceiver.phone,
      });
    }

    if (voucher.exchangePartnerReceiver) {
      await this.sms.sendInfoSMS({
        message,
        phone: voucher.exchangePartnerReceiver.phone,
      });
    }

    return this.voucherRepo.findOneOrFail(voucher.id, query);
  }

  async archiveVoucher(query: Query<Voucher>, token: string, dto: ArchiveVoucherDto) {
    const voucher = await this.voucherRepo.findOneOrFail(dto.voucherId, {
      id: true,
      seller: { id: true },
      dateArchived: true,
    });

    await this.auth.authenticateFromProfileId(voucher.seller.id, token);

    if (voucher.dateArchived) {
      throw new HttpException(`This voucher is already archived.`, HttpStatus.BAD_REQUEST);
    }

    await this.voucherRepo.update(voucher.id, { dateArchived: new Date() });

    return this.voucherRepo.findOneOrFail(voucher.id, query);
  }

  async unarchiveVoucher(query: Query<Voucher>, token: string, dto: UnarchiveVoucherDto) {
    const voucher = await this.voucherRepo.findOneOrFail(dto.voucherId, {
      id: true,
      seller: { id: true },
      dateArchived: true,
    });

    await this.auth.authenticateFromProfileId(voucher.seller.id, token);

    if (!voucher.dateArchived) {
      throw new HttpException(`This voucher is already unarchived.`, HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.voucherRepo.update(voucher.id, { dateArchived: null! });

    return this.voucherRepo.findOneOrFail(voucher.id, query);
  }
}
