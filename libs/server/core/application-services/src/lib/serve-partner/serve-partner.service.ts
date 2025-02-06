import { ServePartnerRepository } from '@involvemint/server/core/domain-services';
import {
  DeleteSpImageDto,
  EditSpProfileDto,
  generateServePartnerImageFilePath,
  generateServePartnerLogoFilePath,
  ImStorageFileRoots,
  ServePartner,
  UpdateSpLogoFileDto,
  UploadSpImagesDto,
  Query
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ServePartnerService {
  constructor(
    private readonly spRepo: ServePartnerRepository,
    private readonly auth: AuthService,
    private readonly storage: StorageService,
    private readonly firestore: FirestoreService
  ) {}

  async editProfile(query: Query<ServePartner>, token: string, dto: EditSpProfileDto) {
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true, logoFilePath: true, handle: { id: true } } },
    });

    const admin = user.serveAdmins.find((ea) => ea.servePartner.id === dto.spId);

    if (!admin) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    const logoFilePath = admin?.servePartner.logoFilePath;

    if (dto.changes.logoFilePath === '' && logoFilePath) {
      this.storage.deleteFile(logoFilePath);
    }

    if (dto.changes.handle?.id && admin.servePartner.handle.id !== dto.changes.handle.id) {
      await this.firestore.changeHandleInChat(admin.servePartner.handle.id, dto.changes.handle.id);
    }

    return this.spRepo.update(dto.spId, dto.changes, query);
  }

  async updateLogoFile(
    query: Query<ServePartner>,
    token: string,
    dto: UpdateSpLogoFileDto,
    file: Express.Multer.File
  ) {
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true } },
    });

    if (!user.serveAdmins.some((ea) => ea.servePartner.id === dto.spId)) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    const ext = this.storage.extractFileExtension(file.originalname);
    const name = `${dto.spId}.${ext}`;
    const path = generateServePartnerLogoFilePath({
      root: ImStorageFileRoots.epLogoFiles,
      filename: name,
    });
    await this.storage.upload(path, file);

    return this.spRepo.update(dto.spId, { logoFilePath: path }, query);
  }

  async uploadImages(
    query: Query<ServePartner>,
    token: string,
    dto: UploadSpImagesDto,
    files: Express.Multer.File[]
  ) {
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true, imagesFilePaths: true } },
    });

    const admin = user.serveAdmins.find((ea) => ea.servePartner.id === dto.spId);

    if (!admin) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    const imagesFilePaths = await Promise.all(
      files.map(async (file) => {
        const ext = this.storage.extractFileExtension(file.originalname);
        const filename = `${uuid.v4()}.${ext}`;
        const path = generateServePartnerImageFilePath({
          root: ImStorageFileRoots.projectImages,
          spId: dto.spId,
          filename,
        });
        await this.storage.upload(path, file);
        return path;
      })
    );

    return this.spRepo.update(
      dto.spId,
      { imagesFilePaths: [...(admin?.servePartner.imagesFilePaths || []), ...imagesFilePaths] },
      query
    );
  }

  async deleteImage(query: Query<ServePartner>, token: string, dto: DeleteSpImageDto) {
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true, imagesFilePaths: true } },
    });

    const admin = user.serveAdmins.find((ea) => ea.servePartner.id === dto.spId);

    if (!admin) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    const removed = [...(admin?.servePartner.imagesFilePaths || [])];
    const removedImagesFilePaths = removed.splice(dto.imagesFilePathsIndex, 1);

    this.storage.deleteFile(removedImagesFilePaths[0]);

    const newImageFilePaths: Partial<ServePartner> = { imagesFilePaths: removed };

    return this.spRepo.update(dto.spId, newImageFilePaths, query);
  }
}
