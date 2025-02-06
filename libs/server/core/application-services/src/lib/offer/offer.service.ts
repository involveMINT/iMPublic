import { OfferRepository } from '@involvemint/server/core/domain-services';
import {
  CreateOfferDto,
  DeleteOfferDto,
  DeleteOfferImageDto,
  generateOfferImageFilePath,
  GetOffersForProfileDto,
  GetOneOfferDto,
  ImStorageFileRoots,
  Offer,
  QueryOffersDto,
  UpdateOfferDto,
  UploadOfferImageDto,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class OfferService {
  constructor(
    private readonly offerRepo: OfferRepository,
    private readonly auth: AuthService,
    private readonly storage: StorageService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async query(query: Query<Offer[]>, dto: QueryOffersDto) {
    // TODO dto
    return this.offerRepo.query(query, { where: { listingStatus: 'public' } });
  }

  async getOne(query: Query<Offer>, dto: GetOneOfferDto) {
    const offer = await this.offerRepo.findOneOrFail(dto.offerId, { listingStatus: true });
    if (offer.listingStatus === 'private') {
      throw new HttpException('This offer is private', HttpStatus.UNAUTHORIZED);
    }
    return this.offerRepo.findOneOrFail(dto.offerId, query);
  }

  async getForProfile(query: Query<Offer>, token: string, dto: GetOffersForProfileDto) {
    await this.auth.authenticateFromProfileId(dto.profileId, token);

    return this.offerRepo.query(query, {
      where: [
        { changeMaker: dto.profileId },
        { servePartner: dto.profileId },
        { exchangePartner: dto.profileId },
      ],
    });
  }

  async create(query: Query<Offer>, token: string, dto: CreateOfferDto) {
    const user = await this.auth.authenticateFromProfileId(dto.profileId, token);

    const now = new Date();
    return this.offerRepo.upsert(
      {
        id: uuid.v4(),
        dateCreated: now,
        dateUpdated: now,
        name: '',
        description: '',
        imagesFilePaths: [],
        listingStatus: 'private',
        price: 0,
        changeMaker: user.changeMaker ?? null,
        exchangePartner: user.exchangePartner ?? null,
        servePartner: user.servePartner ?? null,
      },
      query
    );
  }

  async update(query: Query<Offer>, token: string, dto: UpdateOfferDto) {
    const offer = await this.offerRepo.findOneOrFail(dto.offerId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
    });

    await this.auth.authenticateFromProfileId(
      offer.changeMaker?.id || offer.exchangePartner?.id || offer.servePartner?.id,
      token
    );

    return this.offerRepo.update(dto.offerId, { ...dto.changes, dateUpdated: new Date() }, query);
  }

  async delete(query: Query<{ deletedId: string }>, token: string, dto: DeleteOfferDto) {
    const offer = await this.offerRepo.findOneOrFail(dto.offerId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
      vouchers: { id: true },
    });

    await this.auth.authenticateFromProfileId(
      offer.changeMaker?.id || offer.exchangePartner?.id || offer.servePartner?.id,
      token
    );

    if (offer.vouchers && offer.vouchers.length > 0) {
      throw new HttpException(
        `This Offer cannot be deleted since someone has purchased a voucher and linked this offer to it.
        If you want to hide this offer from your Storefront, set the visibility to private.`,
        HttpStatus.CONFLICT
      );
    }

    await this.offerRepo.delete(dto.offerId);

    return parseQuery(query, { deletedId: dto.offerId });
  }

  async uploadImages(
    query: Query<Offer>,
    token: string,
    dto: UploadOfferImageDto,
    files: Express.Multer.File[]
  ) {
    const offer = await this.offerRepo.findOneOrFail(dto.offerId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.auth.authenticateFromProfileId(
      offer.changeMaker?.id || offer.exchangePartner?.id || offer.servePartner?.id,
      token
    );

    const imagesFilePaths = await Promise.all(
      files.map(async (file) => {
        const ext = this.storage.extractFileExtension(file.originalname);
        const filename = `${uuid.v4()}.${ext}`;
        const path = generateOfferImageFilePath({
          root: ImStorageFileRoots.offerImages,
          offerId: dto.offerId,
          filename,
        });
        await this.storage.upload(path, file);
        return path;
      })
    );

    return this.offerRepo.update(
      dto.offerId,
      { imagesFilePaths: [...offer.imagesFilePaths, ...imagesFilePaths] },
      query
    );
  }

  async deleteImage(query: Query<Offer>, token: string, dto: DeleteOfferImageDto) {
    const offer = await this.offerRepo.findOneOrFail(dto.offerId, {
      changeMaker: { id: true },
      exchangePartner: { id: true },
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.auth.authenticateFromProfileId(
      offer.changeMaker?.id || offer.exchangePartner?.id || offer.servePartner?.id,
      token
    );

    this.storage.deleteFile(offer.imagesFilePaths[dto.index]);

    return this.offerRepo.update(
      dto.offerId,
      { imagesFilePaths: offer.imagesFilePaths.filter((_, i) => i !== dto.index) },
      query
    );
  }
}
