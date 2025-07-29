import { defaultRequestListingStatus, Request, RequestListingStatus } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: 'Request' })
export class RequestEntity implements Required<Request> {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { default: defaultRequestListingStatus })
  listingStatus!: RequestListingStatus;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  priceStatus!: boolean;

  @Column()
  price!: number;

  @Column('text', { array: true, default: '{}' })
  imagesFilePaths!: string[];

  @Column({ default: () => "now()" })
  dateUpdated!: Date;

  @Column({ default: () => "now()" })
  dateCreated!: Date;

  @ManyToOne(() => ChangeMakerEntity, (e) => e.requests, { nullable: true })
  changeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.requests, { nullable: true })
  exchangePartner!: ExchangePartnerEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.requests, { nullable: true })
  servePartner!: ServePartnerEntity;
}
