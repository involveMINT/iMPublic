import { defaultOfferListingStatus, Offer, OfferListingStatus } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { LinkedVoucherOfferEntity } from '../linked-voucher-offers/linked-voucher-offers.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: DbTableNames.Offer })
export class OfferEntity implements Required<Offer> {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { default: defaultOfferListingStatus })
  listingStatus!: OfferListingStatus;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column('text', { array: true, default: '{}' })
  imagesFilePaths!: string[];

  @Column({ default: () => "now()" })
  dateUpdated!: Date;

  @Column({ default: () => "now()" })
  dateCreated!: Date;

  @OneToOne(() => AddressEntity, (e) => e.offer, { nullable: true, cascade: true })
  address!: AddressEntity;

  @ManyToOne(() => ChangeMakerEntity, (e) => e.offers, { nullable: true })
  changeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.offers, { nullable: true })
  exchangePartner!: ExchangePartnerEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.offers, { nullable: true })
  servePartner!: ServePartnerEntity;

  @OneToMany(() => LinkedVoucherOfferEntity, (e) => e.offer, { nullable: false })
  vouchers!: LinkedVoucherOfferEntity[];
}
