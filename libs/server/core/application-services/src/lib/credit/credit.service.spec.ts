import { CreditRepository } from '@involvemint/server/core/domain-services';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'uuid';
import { AuthService } from '../auth/auth.service';
import { CreditService } from './credit.service';

jest.mock('uuid', () => ({ v4: () => 'newId' }));

describe('Transaction Service', () => {
  let creditService: CreditService;
  let creditRepo: CreditRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreditService,
        { provide: CreditRepository, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    creditService = moduleRef.get(CreditService);

    creditRepo = moduleRef.get(CreditRepository);
    creditRepo.query = jest.fn();
    creditRepo.upsertMany = jest.fn();
  });

  describe('transferCreditsToEscrow', () => {
    it('reject zero amount', async () => {
      jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
        {
          id: ' id1',
          amount: 10,
          dateMinted: new Date(0),
          escrow: true,
        },
      ]);
      await expect(() => creditService.transferCreditsInToEscrow('id', 0)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('reject decimal amount', async () => {
      jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
        {
          id: ' id1',
          amount: 10,
          dateMinted: new Date(0),
          escrow: true,
        },
      ]);
      await expect(() => creditService.transferCreditsInToEscrow('id', 1.0)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    describe(`should error if the total amount of credits is less
              than the amount requested to be transferred to escrow`, () => {
      it('one credit in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsInToEscrow('id', 1)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('two credits in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: ' id2',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsInToEscrow('id', 1)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('one credit not in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
        await expect(() => creditService.transferCreditsInToEscrow('id', 12)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('one credit not in escrow one credit in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: ' id2',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsInToEscrow('id', 12)).rejects.toThrow(
          InternalServerErrorException
        );
      });
    });

    describe(`should upsert many if the total amount of credits is more
              than or equal to the amount requested to be transferred to escrow`, () => {
      it('one credit exactly the correct amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsInToEscrow('id', 10);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
      });

      it('two credits exactly the correct amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsInToEscrow('id', 10);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id2',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
      });

      it('one credit -> fractional amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsInToEscrow('id', 4);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'newId',
            amount: 4,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id1',
            amount: 6,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
      });

      it('two credits -> one is more than amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsInToEscrow('id', 6);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'newId',
            amount: 1,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id2',
            amount: 9,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
      });
    });
  });

  describe('transferCreditsOutOfEscrow', () => {
    describe(`should error if the total amount of escrow credits is less
              than the amount requested to be transferred out of escrow`, () => {
      it('one credit in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsOutOfEscrow('id', 11)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('two credits in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: ' id2',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsOutOfEscrow('id', 7)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('one credit not in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
        await expect(() => creditService.transferCreditsOutOfEscrow('id', 5)).rejects.toThrow(
          InternalServerErrorException
        );
      });

      it('one credit not in escrow one credit in escrow', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: ' id1',
            amount: 3,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: ' id2',
            amount: 3,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
        await expect(() => creditService.transferCreditsOutOfEscrow('id', 12)).rejects.toThrow(
          InternalServerErrorException
        );
      });
    });

    describe(`should upsert many if the total amount of credits is more
              than or equal to the amount requested to be transferred to escrow`, () => {
      it('one credit exactly the correct amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsOutOfEscrow('id', 10);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
      });

      it('two credits exactly the correct amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id2',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);

        await creditService.transferCreditsOutOfEscrow('id', 10);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);
      });

      it('one credit -> fractional amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);

        await creditService.transferCreditsOutOfEscrow('id', 4);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'newId',
            amount: 4,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 6,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
      });

      it('two credits -> one is more than amount', async () => {
        jest.spyOn(creditRepo, 'query').mockImplementation(async () => [
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id2',
            amount: 10,
            dateMinted: new Date(0),
            escrow: true,
          },
          {
            id: 'id3',
            amount: 10,
            dateMinted: new Date(0),
            escrow: false,
          },
        ]);

        await creditService.transferCreditsOutOfEscrow('id', 6);
        expect(creditRepo.upsertMany).toHaveBeenCalledWith([
          {
            id: 'id1',
            amount: 5,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'newId',
            amount: 1,
            dateMinted: new Date(0),
            escrow: false,
          },
          {
            id: 'id2',
            amount: 9,
            dateMinted: new Date(0),
            escrow: true,
          },
        ]);
      });
    });
  });
});
