import { PassportDocumentRepository } from '@involvemint/server/core/domain-services';
import {
  EditPassportDocumentDto,
  generatePassportDocumentFilePath,
  ImStorageFileRoots,
  PassportDocument,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PassportService {
  constructor(
    private readonly auth: AuthService,
    private readonly passportRepo: PassportDocumentRepository,
    private readonly storage: StorageService
  ) {}

  async get(query: Query<PassportDocument[]>, token: string) {
    const user = await this.auth.validateUserToken(token, { id: true, changeMaker: { id: true } });

    if (!user?.changeMaker) {
      throw new HttpException(
        `No associated ChangeMaker Profile found with user "${user.id}".`,
        HttpStatus.NOT_FOUND
      );
    }

    return this.passportRepo.query(query, { where: { changeMaker: { id: user.changeMaker.id } } });
  }

  async create(query: Query<PassportDocument>, token: string, file: Express.Multer.File) {
    const user = await this.auth.validateUserToken(token, { id: true, changeMaker: { id: true } });

    if (!user?.changeMaker) {
      throw new HttpException(
        `No associated ChangeMaker Profile found with user "${user.id}".`,
        HttpStatus.NOT_FOUND
      );
    }

    const docId = uuid.v4();
    const path = await this.createPassportDocument(file, docId, user.changeMaker.id);

    return this.passportRepo.upsert(
      {
        id: docId,
        changeMaker: user.changeMaker.id,
        enrollmentDocuments: [],
        name: file.originalname,
        filePath: path,
        uploadedDate: new Date(),
      },
      query
    );
  }

  async edit(query: Query<PassportDocument>, token: string, dto: EditPassportDocumentDto) {
    const user = await this.auth.validateUserToken(token, { changeMaker: { id: true } });
    const document = await this.passportRepo.findOneOrFail(dto.documentId, {
      changeMaker: { id: true },
      filePath: true,
      name: true,
    });

    if (user?.changeMaker?.id !== document.changeMaker?.id) {
      throw new HttpException('You do not own this passport document.', HttpStatus.UNAUTHORIZED);
    }

    return this.passportRepo.update(dto.documentId, dto, query);
  }

  async replace(
    query: Query<PassportDocument>,
    token: string,
    dto: EditPassportDocumentDto,
    file: Express.Multer.File
  ) {
    const user = await this.auth.validateUserToken(token, { changeMaker: { id: true } });
    const document = await this.passportRepo.findOneOrFail(dto.documentId, {
      id: true,
      changeMaker: { id: true },
      filePath: true,
      name: true,
    });

    if (user?.changeMaker?.id !== document.changeMaker?.id) {
      throw new HttpException('You do not own this passport document.', HttpStatus.UNAUTHORIZED);
    }

    await this.storage.deleteFile(document.filePath);
    const path = await this.createPassportDocument(file, document.id, user.changeMaker.id);
    return this.passportRepo.update(
      dto.documentId,
      { ...dto, uploadedDate: new Date(), filePath: path },
      query
    );
  }

  async delete(query: Query<{ deletedId: string }>, token: string, dto: EditPassportDocumentDto) {
    const user = await this.auth.validateUserToken(token, { changeMaker: { id: true } });
    const document = await this.passportRepo.findOneOrFail(dto.documentId, {
      changeMaker: { id: true },
      filePath: true,
      name: true,
    });

    if (user?.changeMaker?.id !== document.changeMaker?.id) {
      throw new HttpException('You do not own this passport document.', HttpStatus.UNAUTHORIZED);
    }

    this.storage.deleteFile(document.filePath);
    return parseQuery(query, { deletedId: await this.passportRepo.delete(dto.documentId) });
  }

  private async createPassportDocument(file: Express.Multer.File, docId: string, cmId: string) {
    const ext = this.storage.extractFileExtension(file.originalname);
    const filename = `${docId}.${ext}`;
    const path = generatePassportDocumentFilePath({ root: ImStorageFileRoots.passport, cmId, filename });
    await this.storage.upload(path, file);
    return path;
  }
}
