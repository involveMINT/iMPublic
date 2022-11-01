import { IsArray, IsString } from 'class-validator';

export abstract class GetVouchersForProfileDto {
  @IsString()
  profileId!: string;
}

export abstract class GetVouchersBySellerDto {
  @IsString()
  epId!: string;
}

export abstract class BuyVoucherDto {
  @IsString()
  buyerId!: string;

  @IsString()
  sellerId!: string;

  @IsArray()
  offers!: Array<{ offerId: string; quantity: number }>;
}

export abstract class RedeemVoucherDto {
  @IsString()
  sellerId!: string;

  @IsString()
  code!: string;
}

export abstract class RefundVoucherDto {
  @IsString()
  voucherId!: string;
}

export abstract class ArchiveVoucherDto {
  @IsString()
  voucherId!: string;
}

export abstract class UnarchiveVoucherDto {
  @IsString()
  voucherId!: string;
}
