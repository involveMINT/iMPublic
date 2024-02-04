import { OfferService } from '@involvemint/server/core/application-services';
import {
  CreateOfferDto,
  DeleteOfferDto,
  DeleteOfferImageDto,
  GetOffersForProfileDto,
  GetOneOfferDto,
  InvolvemintRoutes,
  IOfferOrchestration,
  Offer,
  OfferMarketQuery,
  OfferQuery,
  QueryOffersDto,
  UpdateOfferDto,
  UploadOfferImageDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.offer)
export class OfferOrchestration implements IServerOrchestration<IOfferOrchestration> {
  constructor(private readonly offer: OfferService) {}

  @ServerOperation({ validateQuery: OfferMarketQuery })
  query(query: IQuery<Offer[]>, _: string, dto: QueryOffersDto) {
    return this.offer.query(query, dto);
  }

  @ServerOperation({ validateQuery: OfferMarketQuery })
  getOne(query: IQuery<Offer>, _: string, dto: GetOneOfferDto) {
    return this.offer.getOne(query, dto);
  }

  @ServerOperation({ validateQuery: OfferQuery })
  getForProfile(query: IQuery<Offer[]>, token: string, dto: GetOffersForProfileDto) {
    return this.offer.getForProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: OfferQuery })
  create(query: IQuery<Offer>, token: string, dto: CreateOfferDto) {
    return this.offer.create(query, token, dto);
  }

  @ServerOperation({ validateQuery: OfferQuery })
  update(query: IQuery<Offer>, token: string, dto: UpdateOfferDto) {
    return this.offer.update(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  delete(query: IQuery<{ deletedId: string }>, token: string, dto: DeleteOfferDto) {
    return this.offer.delete(query, token, dto);
  }

  @ServerOperation({ validateQuery: OfferQuery, fileUpload: 'multiple' })
  uploadImages(query: IQuery<Offer>, token: string, dto: UploadOfferImageDto, files: Express.Multer.File[]) {
    return this.offer.uploadImages(query, token, dto, files);
  }

  @ServerOperation({ validateQuery: OfferQuery })
  deleteImage(query: IQuery<Offer>, token: string, dto: DeleteOfferImageDto) {
    return this.offer.deleteImage(query, token, dto);
  }
}
