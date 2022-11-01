import { IsInt, IsString } from 'class-validator';

export abstract class GetTransactionsForProfileDto {
  @IsString()
  profileId!: string;
}

export abstract class TransactionDto {
  @IsString()
  senderHandle!: string;

  @IsString()
  receiverHandle!: string;

  @IsInt()
  amount!: number;

  @IsString()
  memo!: string;
}
