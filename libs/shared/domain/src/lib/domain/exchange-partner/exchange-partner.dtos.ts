import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { ExchangePartner } from './exchange-partner.model';

export abstract class ExchangePartnerMarketQueryDto {
  @IsNotEmpty()
  @IsNumber()
  distance!: number;
}

export abstract class EditEpProfileDto {
  @IsString()
  epId!: string;

  @IsNotEmptyObject()
  changes!: Partial<ExchangePartner>;
}

export abstract class UpdateEpLogoFileDto {
  @IsString()
  epId!: string;
}

export abstract class GetOneExchangePartnerDto {
  @IsString()
  epId!: string;
}

export abstract class SearchEpDto {
  @IsString()
  epSearchString!: string;
}

export abstract class UploadEpImagesDto {
  @IsNotEmpty()
  @IsString()
  epId!: string;
}

export abstract class DeleteEpImageDto {
  @IsNotEmpty()
  @IsString()
  epId!: string;

  @IsNumber()
  imagesFilePathsIndex!: number;
}
