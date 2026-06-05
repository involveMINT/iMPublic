import {
  CreditRepository,
  HandleRepository,
  TransactionRepository,
  VoucherRepository,
} from '@involvemint/server/core/domain-services';
import { FRONTEND_ROUTES_TOKEN, ImConfig, TransactionDto } from '@involvemint/shared/domain';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { AuthService } from '../auth/auth.service';
import { CreditService } from '../credit/credit.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';
import { CreditQuery, CreditStoreModel, TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  let creditRepo: CreditRepository;
  let handleRepo: HandleRepository;
  let transactionRepo: TransactionRepository;
  let credit: CreditService;

  /** Captures the credits written by the last transaction so tests can assert on coin shape. */
  let upserted: CreditStoreModel[];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: AuthService, useValue: {} },
        { provide: TransactionRepository, useValue: {} },
        { provide: VoucherRepository, useValue: {} },
        { provide: CreditRepository, useValue: {} },
        { provide: HandleRepository, useValue: {} },
        { provide: DbTransactionCreator, useValue: {} },
        { provide: CreditService, useValue: {} },
        { provide: EmailService, useValue: {} },
        { provide: SMSService, useValue: {} },
        { provide: FRONTEND_ROUTES_TOKEN, useValue: { path: { wallet: { ROOT: '/wallet' } } } },
      ],
    }).compile();

    transactionService = module.get(TransactionService);

    creditRepo = module.get(CreditRepository);
    creditRepo.query = jest.fn();
    upserted = [];
    creditRepo.upsertMany = jest.fn().mockImplementation((c: CreditStoreModel[]) => {
      upserted = c;
      return Promise.resolve(c);
    });
    creditRepo.deleteMany = jest.fn().mockResolvedValue([]);

    handleRepo = module.get(HandleRepository);
    handleRepo.findOneOrFail = jest.fn();

    transactionRepo = module.get(TransactionRepository);
    transactionRepo.query = jest.fn().mockResolvedValue([]);
    transactionRepo.upsert = jest.fn().mockResolvedValue({});
    transactionRepo.findOneOrFail = jest.fn().mockResolvedValue({});

    credit = module.get(CreditService);
    credit.getDebt = jest.fn().mockResolvedValue(0);
    credit.incurDebt = jest.fn().mockResolvedValue(undefined);
    credit.settleDebt = jest.fn().mockResolvedValue(undefined);

    const email = module.get(EmailService);
    email.sendInfoEmail = jest.fn().mockResolvedValue(undefined);

    const sms = module.get(SMSService);
    sms.sendInfoSMS = jest.fn().mockResolvedValue(undefined);
  });

  /** Sum of positive coins the receiver gains in `upserted` (excludes the sender's reduced coin). */
  function receiverCoinsGained() {
    return upserted
      .filter((c) => c.amount > 0 && c.changeMaker != null && (c.changeMaker as { id: string }).id === 'receiverId')
      .reduce((s, c) => s + c.amount, 0);
  }

  function transaction(
    dto: TransactionDto,
    {
      senderAmount,
      receiverAmount,
    }: {
      senderAmount: number;
      receiverAmount: number;
    } = { senderAmount: 0, receiverAmount: 0 }
  ) {
    when(handleRepo.findOneOrFail as jest.Mock)
      .calledWith(dto.senderHandle, {
        changeMaker: { id: true, firstName: true, lastName: true },
        exchangePartner: {
          id: true,
          name: true,
        },
        servePartner: { id: true, name: true },
      })
      .mockResolvedValue({
        changeMaker: {
          id: 'senderId',
          firstName: 'true',
          lastName: '',
        },
      });

    when(creditRepo.query as jest.Mock)
      .calledWith(CreditQuery, {
        where: [
          { changeMaker: { id: 'senderId' } },
          { exchangePartner: { id: undefined } },
          { servePartner: { id: undefined } },
        ],
      })
      .mockResolvedValue([
        {
          id: 'senderCreditId1',
          amount: senderAmount,
          dateMinted: new Date(),
          escrow: false,
          changeMaker: { id: 'senderId' },
        },
      ] as CreditStoreModel[]);

    when(handleRepo.findOneOrFail as jest.Mock)
      .calledWith(dto.receiverHandle, {
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
      })
      .mockResolvedValue({
        changeMaker: {
          id: 'receiverId',
          firstName: 'true',
          lastName: '',
          user: { id: 'receiverUserId' },
        },
      });

    when(creditRepo.query as jest.Mock)
      .calledWith(CreditQuery, {
        where: [
          { changeMaker: { id: 'receiverId' } },
          { exchangePartner: { id: undefined } },
          { servePartner: { id: undefined } },
        ],
      })
      .mockResolvedValue([
        {
          id: 'receiverCreditId1',
          amount: receiverAmount,
          dateMinted: new Date(),
          escrow: false,
          changeMaker: { id: 'receiverId' },
        },
      ] as CreditStoreModel[]);

    return transactionService['transaction']({}, dto, false);
  }

  describe('checks', () => {
    it('cannot send credits to yourself', async () => {
      await expect(() =>
        transaction({
          receiverHandle: 'senderHandle',
          senderHandle: 'senderHandle',
          amount: 0,
          memo: '',
        })
      ).rejects.toThrow('Cannot conduct a transaction with yourself.');
    });
    it('amount can only be greater than 0', async () => {
      await expect(() =>
        transaction({
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 0,
          memo: '',
        })
      ).rejects.toThrow('Amount must be an non-zero integer.');
    });
    it('amount can only be integers', async () => {
      await expect(() =>
        transaction({
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 0.1,
          memo: '',
        })
      ).rejects.toThrow('Amount must be an non-zero integer.');
    });
    it('amount cannot be greater than maximum amount', async () => {
      await expect(() =>
        transaction({
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: ImConfig.maxCreditTransactionAmount + 1,
          memo: '',
        })
      ).rejects.toThrow('CommunityCredits amount exceeds maximum transaction amount.');
    });
    it('throws when the payment would exceed the negative balance limit', async () => {
      const overLimit = ImConfig.negativeBalanceLimit.changeMaker + 100;
      await expect(() =>
        transaction(
          {
            receiverHandle: 'receiverHandle',
            senderHandle: 'senderHandle',
            amount: overLimit,
            memo: '',
          },
          { senderAmount: 0, receiverAmount: 0 }
        )
      ).rejects.toThrow('negative balance limit');
    });
  });

  describe('mutual credit (Model A)', () => {
    it('a fully-funded payment deducts coins and creates NO debt', async () => {
      await transaction(
        {
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 900,
          memo: '',
        },
        { senderAmount: 1100, receiverAmount: 0 }
      );

      // Sender keeps a single reduced coin (1100 - 900 = 200); no debt incurred.
      expect(credit.incurDebt).not.toHaveBeenCalled();
      const senderCoin = upserted.find(
        (c) => (c.changeMaker as { id: string } | null)?.id === 'senderId'
      );
      expect(senderCoin?.amount).toBe(200);
      // No negative coin anywhere.
      expect(upserted.some((c) => c.amount < 0)).toBe(false);
      // Receiver gains exactly the transfer amount.
      expect(receiverCoinsGained()).toBe(900);
    });

    it('an overdraft records debt (no negative coin) and makes the receiver whole', async () => {
      await transaction(
        {
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 900,
          memo: '',
        },
        { senderAmount: 0, receiverAmount: 0 }
      );

      // Shortfall (full 900) recorded as sender debt — not a coin.
      expect(credit.incurDebt).toHaveBeenCalledWith('changeMaker', 'senderId', 900);
      expect(upserted.some((c) => c.amount < 0)).toBe(false);
      // Receiver still receives the full amount.
      expect(receiverCoinsGained()).toBe(900);
    });

    it('a partial overdraft only debts the uncovered portion', async () => {
      await transaction(
        {
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 900,
          memo: '',
        },
        { senderAmount: 500, receiverAmount: 0 }
      );

      // 500 covered by coins, 400 becomes debt.
      expect(credit.incurDebt).toHaveBeenCalledWith('changeMaker', 'senderId', 400);
      expect(upserted.some((c) => c.amount < 0)).toBe(false);
      expect(receiverCoinsGained()).toBe(900);
    });

    it('settles the receiver debt after they are paid', async () => {
      await transaction(
        {
          receiverHandle: 'receiverHandle',
          senderHandle: 'senderHandle',
          amount: 900,
          memo: '',
        },
        { senderAmount: 1100, receiverAmount: 0 }
      );
      expect(credit.settleDebt).toHaveBeenCalledWith('changeMaker', 'receiverId');
    });
  });
});
