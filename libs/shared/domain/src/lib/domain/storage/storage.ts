import { IsNotEmpty, IsString } from "class-validator";

export const enum ImStorageFileRoots {
  cmProfileImages = 'cm-profile-images',
  epImageFiles = 'ep-image-files',
  epLogoFiles = 'ep-logo-files',
  offerImages = 'offer-images',
  requestImages = 'request-images',
  passport = 'passport',
  poi = 'poi-images',
  projectImages = 'project-images',
  projectCustomWaiver = 'project-custom-waiver',
  spImageFiles = 'sp-image-files',
  spLogoFiles = 'sp-logo-files',
}

export abstract class GetStorageFileDto {
  @IsNotEmpty()
  @IsString()
  path!: string;
}
