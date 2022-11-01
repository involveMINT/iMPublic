import { IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { Offer } from './offer.model';

export abstract class QueryOffersDto {
  @IsNotEmpty()
  @IsNumber()
  distance!: number;
}

export abstract class GetOffersForProfileDto {
  @IsString()
  profileId!: string;
}

export abstract class GetOneOfferDto {
  @IsString()
  offerId!: string;
}

export abstract class CreateOfferDto {
  @IsString()
  profileId!: string;
}

export abstract class UpdateOfferDto {
  @IsString()
  offerId!: string;

  @IsNotEmptyObject()
  changes!: Partial<Omit<Offer, 'id'>>;
}

export abstract class UploadOfferImageDto {
  @IsString()
  offerId!: string;
}

export abstract class DeleteOfferImageDto {
  @IsString()
  offerId!: string;

  @IsInt()
  index!: number;
}

export abstract class DeleteOfferDto {
  @IsString()
  offerId!: string;
}
