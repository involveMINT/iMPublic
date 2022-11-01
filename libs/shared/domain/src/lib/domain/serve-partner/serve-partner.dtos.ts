import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { ServePartner } from './serve-partner.model';

export abstract class EditSpProfileDto {
  @IsString()
  spId!: string;

  @IsNotEmptyObject()
  changes!: Partial<ServePartner>;
}

export abstract class UpdateSpLogoFileDto {
  @IsString()
  spId!: string;
}

export abstract class UploadSpImagesDto {
  @IsNotEmpty()
  @IsString()
  spId!: string;
}

export abstract class DeleteSpImageDto {
  @IsNotEmpty()
  @IsString()
  spId!: string;

  @IsNumber()
  imagesFilePathsIndex!: number;
}
