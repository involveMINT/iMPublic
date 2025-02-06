import { RequestRepository } from '@involvemint/server/core/domain-services';
import {
  CreateRequestDto,
  DeleteRequestDto,
  DeleteRequestImageDto,
  generateRequestImageFilePath,
  GetOneRequestDto,
  GetRequestsForProfileDto,
  ImStorageFileRoots,
  QueryRequestsDto,
  Request,
  UpdateRequestDto,
  UploadRequestImageDto,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepo: RequestRepository,
    private readonly auth: AuthService,
    private readonly storage: StorageService
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async query(query: Query<Request[]>, dto: QueryRequestsDto) {
    // TODO dto
    return this.requestRepo.query(query, { where: { listingStatus: 'public' } });
  }

  async getOne(query: Query<Request>, dto: GetOneRequestDto) {
    const request = await this.requestRepo.findOneOrFail(dto.requestId, { listingStatus: true });
    if (request.listingStatus === 'private') {
      throw new HttpException('This request is private', HttpStatus.UNAUTHORIZED);
    }
    return this.requestRepo.findOneOrFail(dto.requestId, query);
  }

  async getForProfile(query: Query<Request>, token: string, dto: GetRequestsForProfileDto) {
    await this.auth.authenticateFromProfileId(dto.profileId, token);

    return this.requestRepo.query(query, {
      where: [
        { changeMaker: dto.profileId },
        { servePartner: dto.profileId },
        { exchangePartner: dto.profileId },
      ],
    });
  }

  async create(query: Query<Request>, token: string, dto: CreateRequestDto) {
    const user = await this.auth.authenticateFromProfileId(dto.profileId, token);

    const now = new Date();
    return this.requestRepo.upsert(
      {
        id: uuid.v4(),
        dateCreated: now,
        dateUpdated: now,
        name: '',
        description: '',
        imagesFilePaths: [],
        listingStatus: 'private',
        priceStatus: false,
        price: 0,
        changeMaker: user.changeMaker ?? null,
        exchangePartner: user.exchangePartner ?? null,
        servePartner: user.servePartner ?? null,
      },
      query
    );
  }

  async update(query: Query<Request>, token: string, dto: UpdateRequestDto) {
    const request = await this.requestRepo.findOneOrFail(dto.requestId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
    });

    await this.auth.authenticateFromProfileId(
      request.changeMaker?.id || request.exchangePartner?.id || request.servePartner?.id,
      token
    );

    return this.requestRepo.update(dto.requestId, { ...dto.changes, dateUpdated: new Date() }, query);
  }

  async delete(query: Query<{ deletedId: string }>, token: string, dto: DeleteRequestDto) {
    const request = await this.requestRepo.findOneOrFail(dto.requestId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
    });

    await this.auth.authenticateFromProfileId(
      request.changeMaker?.id || request.exchangePartner?.id || request.servePartner?.id,
      token
    );

    await this.requestRepo.delete(dto.requestId);
    return parseQuery(query, { deletedId: dto.requestId });
  }

  async uploadImages(
    query: Query<Request>,
    token: string,
    dto: UploadRequestImageDto,
    files: Express.Multer.File[]
  ) {
    const request = await this.requestRepo.findOneOrFail(dto.requestId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.auth.authenticateFromProfileId(
      request.changeMaker?.id || request.exchangePartner?.id || request.servePartner?.id,
      token
    );

    const imagesFilePaths = await Promise.all(
      files.map(async (file) => {
        const ext = this.storage.extractFileExtension(file.originalname);
        const filename = `${uuid.v4()}.${ext}`;
        const path = generateRequestImageFilePath({
          root: ImStorageFileRoots.requestImages,
          requestId: dto.requestId,
          filename,
        });
        await this.storage.upload(path, file);
        return path;
      })
    );

    return this.requestRepo.update(
      dto.requestId,
      { imagesFilePaths: [...request.imagesFilePaths, ...imagesFilePaths] },
      query
    );
  }

  async deleteImage(query: Query<Request>, token: string, dto: DeleteRequestImageDto) {
    const request = await this.requestRepo.findOneOrFail(dto.requestId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.auth.authenticateFromProfileId(
      request.changeMaker?.id || request.exchangePartner?.id || request.servePartner?.id,
      token
    );

    this.storage.deleteFile(request.imagesFilePaths[dto.index]);

    return this.requestRepo.update(
      dto.requestId,
      { imagesFilePaths: request.imagesFilePaths.filter((_, i) => i !== dto.index) },
      query
    );
  }
}
