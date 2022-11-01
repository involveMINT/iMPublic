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
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';
import { CreditQuery, CreditStoreModel, TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  let auth: AuthService;
  let transactionRepo: TransactionRepository;
  let voucherRepo: VoucherRepository;
  let creditRepo: CreditRepository;
  let handleRepo: HandleRepository;
  let dbTransaction: DbTransactionCreator;
  let email: EmailService;
  let sms: SMSService;

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
        { provide: EmailService, useValue: {} },
        { provide: SMSService, useValue: {} },
        { provide: FRONTEND_ROUTES_TOKEN, useValue: {} },
      ],
    }).compile();

    transactionService = module.get(TransactionService);

    auth = module.get(AuthService);

    transactionRepo = module.get(TransactionRepository);

    voucherRepo = module.get(VoucherRepository);

    creditRepo = module.get(CreditRepository);
    creditRepo.query = jest.fn();

    handleRepo = module.get(HandleRepository);
    handleRepo.findOneOrFail = jest.fn();

    dbTransaction = module.get(DbTransactionCreator);

    email = module.get(EmailService);

    sms = module.get(SMSService);
  });

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
        },
      ] as CreditStoreModel[]);

    return transactionService['transaction']({}, dto, false);

    // when(handle.getHandleFromAccountId as jest.Mock)
    //   .calledWith(dto.senderId)
    //   .mockResolvedValue({ type: 'ChangeMaker', handle: 'senderHandle' } as HandleResponse);

    // when(handle.getHandleFromAccountId as jest.Mock)
    //   .calledWith(dto.receiverId)
    //   .mockResolvedValue({ type: receiverType, handle: 'receiverHandle' } as HandleResponse);

    // when(spRepo.findOneOrFail as jest.Mock)
    //   .calledWith(dto.receiverId, ['spendPartnerView'])
    //   .mockResolvedValue({
    //     budget: 10,
    //     spendPartnerView: { receivedThisMonth: 0 },
    //   } as SpendPartnerJoin<'spendPartnerView'>);

    // when(transactionRepo.findAllTransactions as jest.Mock)
    //   .calledWith(dto.receiverId, [])
    //   .mockResolvedValue([]);

    // jest.spyOn(serveAdminRepo, 'findAllServeAdminAccountsByServePartnerId').mockResolvedValue([]);
    // jest.spyOn(spendAdminRepo, 'findAllSpendAdminAccountsBySpendPartnerId').mockResolvedValue([]);
    // jest.spyOn(cmRepo, 'findMany').mockResolvedValue([]);
    // jest.spyOn(dbTransaction, 'run').mockImplementation((c) => c());
    // MockDate.set(new Date(1));
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
    it('sender must have enough credits', async () => {
      await expect(() =>
        transaction(
          {
            receiverHandle: 'receiverHandle',
            senderHandle: 'senderHandle',
            amount: 2,
            memo: '',
          },
          { senderAmount: 1, receiverAmount: 0 }
        )
      ).rejects.toThrow('Insufficient credits to fulfill transaction.');
    });
  });
});
