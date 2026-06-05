import {
  ChangeMakerRepository,
  CreditRepository,
  ExchangePartnerRepository,
  HandleRepository,
  ServePartnerRepository,
} from '@involvemint/server/core/domain-services';
import {
  calculateTotalCreditsAmount,
  calculateTotalEscrowAmount,
  Credit,
  EntityType,
  getNegativeBalanceLimit,
  GetCreditsForProfileDto,
  MintDto,
} from '@involvemint/shared/domain';
import { isDecimal } from '@involvemint/shared/util';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createQuery, IParser, IQuery } from '@orcha/common';
import { compareAsc } from 'date-fns';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';

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
export class CreditService {
  constructor(
    private readonly creditRepo: CreditRepository,
    private readonly auth: AuthService,
    private readonly handle: HandleRepository,
    private readonly cmRepo: ChangeMakerRepository,
    private readonly epRepo: ExchangePartnerRepository,
    private readonly spRepo: ServePartnerRepository
  ) {}

  /**
   * Reads an account's current mutual-credit debt (in cents, >= 0).
   * Debt is a number on the account — never a `Credit` row — so it never enters the
   * coin transfer/split/merge machinery.
   */
  async getDebt(entityType: EntityType, profileId: string): Promise<number> {
    const profile = await this.getProfileDebt(entityType, profileId);
    return profile?.creditDebt ?? 0;
  }

  /** Increases an account's debt by `amount` cents (used when a payment overdraws the account). */
  async incurDebt(entityType: EntityType, profileId: string, amount: number): Promise<void> {
    if (amount <= 0) return;
    const current = await this.getDebt(entityType, profileId);
    await this.setDebt(entityType, profileId, current + amount);
  }

  /**
   * Repays an account's debt by burning its positive credits (smallest-first).
   * Call after any inflow (transfer received, POI earned, voucher refund). Burning the
   * credits destroys the money that was minted when the account went negative, keeping the
   * total supply conserved. No-op when the account has no debt.
   */
  async settleDebt(entityType: EntityType, profileId: string): Promise<void> {
    const debt = await this.getDebt(entityType, profileId);
    if (debt <= 0) return;

    const credits = (
      await this.creditRepo.query(CreditQuery, {
        where: [{ changeMaker: profileId }, { servePartner: profileId }, { exchangePartner: profileId }],
      })
    )
      .filter((c) => !c.escrow && c.amount > 0)
      .sort((a, b) => a.amount - b.amount);

    let remaining = Math.min(debt, calculateTotalCreditsAmount(credits));
    const settled = remaining;
    const toDelete: string[] = [];
    const toUpdate: CreditStoreModel[] = [];

    for (const credit of credits) {
      if (remaining <= 0) break;
      if (credit.amount <= remaining) {
        toDelete.push(credit.id);
        remaining -= credit.amount;
      } else {
        toUpdate.push({ ...credit, amount: credit.amount - remaining });
        remaining = 0;
      }
    }

    if (toUpdate.length > 0) await this.creditRepo.upsertMany(toUpdate);
    if (toDelete.length > 0) await this.creditRepo.deleteMany(toDelete);
    await this.setDebt(entityType, profileId, debt - settled);
  }

  private async setDebt(entityType: EntityType, profileId: string, value: number): Promise<void> {
    const creditDebt = Math.max(0, value);
    if (entityType === 'changeMaker') {
      await this.cmRepo.update(profileId, { creditDebt });
    } else if (entityType === 'exchangePartner') {
      await this.epRepo.update(profileId, { creditDebt });
    } else {
      await this.spRepo.update(profileId, { creditDebt });
    }
  }

  private getProfileDebt(entityType: EntityType, profileId: string) {
    if (entityType === 'changeMaker') {
      return this.cmRepo.findOneOrFail(profileId, { id: true, creditDebt: true });
    } else if (entityType === 'exchangePartner') {
      return this.epRepo.findOneOrFail(profileId, { id: true, creditDebt: true });
    }
    return this.spRepo.findOneOrFail(profileId, { id: true, creditDebt: true });
  }

  async getCreditsForProfile(query: IQuery<Credit>, token: string, dto: GetCreditsForProfileDto) {
    await this.auth.authenticateFromProfileId(dto.profileId, token);

    return this.creditRepo.query(query, {
      where: [
        { changeMaker: dto.profileId },
        { servePartner: dto.profileId },
        { exchangePartner: dto.profileId },
      ],
    });
  }

  /**
   * Admin only.
   */
  async mint(_: IQuery<Record<string, never>>, token: string, dto: MintDto) {
    await this.auth.validateAdminToken(token);
    const handle = await this.handle.findOneOrFail(dto.handle, {
      id: true,
      changeMaker: { id: true },
      servePartner: { id: true },
      exchangePartner: { id: true },
    });
    await this.creditRepo.upsert({
      id: uuid.v4(),
      amount: dto.amount,
      dateMinted: new Date(),
      escrow: false,
      poi: null,
      changeMaker: handle.changeMaker ? handle.changeMaker.id : null,
      servePartner: handle.servePartner ? handle.servePartner.id : null,
      exchangePartner: handle.exchangePartner ? handle.exchangePartner.id : null,
    });
    return {};
  }

  /**
   * Transfers user's credits into Escrow.
   * @param profileId user's profile ID
   * @param amount
   * @param entityType optional entity type for negative balance support
   */
  transferCreditsInToEscrow(profileId: string, amount: number, entityType?: EntityType) {
    return this.escrowTransfer(profileId, amount, true, entityType);
  }

  /**
   * Transfers user's credits out of Escrow.
   * @param profileId user's profile ID
   * @param amount
   */
  transferCreditsOutOfEscrow(profileId: string, amount: number) {
    return this.escrowTransfer(profileId, amount, false);
  }

  /**
   * Transfers credits either into or out of Escrow depending on the `intoEscrow` flag.
   * @param profileId user's profile ID
   * @param amount
   * @param intoEscrow True if transferring credits into Escrow, false if transferring credits out of Escrow.
   * @param entityType optional entity type for negative balance support (only used when intoEscrow is true)
   */
  private async escrowTransfer(profileId: string, amount: number, intoEscrow: boolean, entityType?: EntityType) {
    if (amount === 0 || isDecimal(amount)) {
      throw new InternalServerErrorException('Amount must be an non-zero integer.');
    }

    /** Current user's credits. */
    const credits = await this.creditRepo.query(CreditQuery, {
      where: [{ changeMaker: profileId }, { servePartner: profileId }, { exchangePartner: profileId }],
    });

    // Sort credits by smallest to largest amount.
    // This is so we don't unnecessarily split a large credit when smaller ones are present.
    credits.sort((a, b) => compareAsc(a.amount, b.amount));

    const availableCredits = calculateTotalCreditsAmount(credits);
    const escrowCredits = calculateTotalEscrowAmount(credits);

    // Check if user has enough credits (with negative balance support for intoEscrow)
    if (intoEscrow) {
      if (entityType) {
        // With negative balance support: spendable = credits - existing debt; may go down to -limit.
        const negativeLimit = getNegativeBalanceLimit(entityType);
        const debt = await this.getDebt(entityType, profileId);
        if (availableCredits - debt - amount < -negativeLimit) {
          throw new InternalServerErrorException(
            `Transaction would exceed your negative balance limit of ${negativeLimit / 100} credits.`
          );
        }
      } else {
        // Without entity type: use original validation (no negative balance)
        if (availableCredits < amount) {
          throw new InternalServerErrorException('Insufficient credits to process transaction.');
        }
      }
    } else {
      // Moving out of escrow: must have enough escrowed credits
      if (escrowCredits < amount) {
        throw new InternalServerErrorException('Insufficient credits to process transaction.');
      }
    }

    /** Amount transferred currently in queue. */
    let amountTransferred = 0;

    /** Update queue for Credits to be updated in DB. */
    const queue: CreditStoreModel[] = [];

    for (const credit of credits) {
      // If transferring into Escrow -> ignore Credit's currently in Escrow.
      if (intoEscrow && credit.escrow) continue;
      // If transferring out of Escrow -> ignore Credit's currently not in Escrow.
      if (!intoEscrow && !credit.escrow) continue;
      // Only positive credits move; debt is tracked on the account, never as a coin.
      if (credit.amount <= 0) continue;

      /** Amount left to transfer (amount that still needs to be placed in `queue`). */
      const amountLeft = amount - amountTransferred;

      // If current credit's amount is <= `amountLeft` then put that credit into Escrow.
      if (credit.amount <= amountLeft) {
        amountTransferred += credit.amount;
        queue.push({ ...credit, escrow: intoEscrow });

        // Break loop if enough credits in the queue; we're done here.
        if (amountTransferred === amount) break;
      } else {
        // If the current credit is greater than `amountLeft`,
        // then split difference with the creation of new credit and the current credit.
        amountTransferred += amountLeft;
        queue.push({ ...credit, id: uuid.v4(), amount: amountLeft, escrow: intoEscrow });
        queue.push({ ...credit, amount: credit.amount - amountLeft });

        // Loop will always break here since the difference is split between current credit and new credit.
        break;
      }
    }

    // Overdraft: not enough credits to fully fund the escrow reservation.
    // Mint the shortfall as escrowed money (the voucher is made whole) and record the
    // shortfall as account DEBT — never a negative coin (which would corrupt later transfers).
    if (intoEscrow && amountTransferred < amount && entityType) {
      const shortfall = amount - amountTransferred;

      queue.push({
        id: uuid.v4(),
        amount: shortfall,
        dateMinted: new Date(),
        escrow: true,
        poi: null,
        changeMaker: entityType === 'changeMaker' ? { id: profileId } : null,
        servePartner: entityType === 'servePartner' ? { id: profileId } : null,
        exchangePartner: entityType === 'exchangePartner' ? { id: profileId } : null,
      } as CreditStoreModel);

      await this.incurDebt(entityType, profileId, shortfall);
    }

    return this.creditRepo.upsertMany(queue);
  }
}
