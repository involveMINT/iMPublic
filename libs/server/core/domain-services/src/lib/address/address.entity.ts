import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { EpApplicationEntity } from '../ep-application/ep-application.entity';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { OfferEntity } from '../offer/offer.entity';
import { ProjectEntity } from '../project/project.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';
import { SpApplicationEntity } from '../sp-application/sp-application.entity';

// TODO implements Required<Address> causes `circularly references itself in mapped type`.
@Entity({ name: DbTableNames.Address })
export class AddressEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  address1!: string;

  @Column({ nullable: true })
  address2!: string;

  @Column({ nullable: true })
  address3!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zip!: string;

  /** Defaults to USA. */
  @Column({ default: 'Unites States' })
  country!: string;

  @OneToOne(() => OfferEntity, (e) => e.address, { nullable: true })
  offer!: OfferEntity;

  @OneToOne(() => ChangeMakerEntity, (e) => e.address, { nullable: true })
  changeMaker!: ChangeMakerEntity;

  @OneToOne(() => ExchangePartnerEntity, (e) => e.address, { nullable: true })
  exchangePartner!: ExchangePartnerEntity;

  @OneToOne(() => ServePartnerEntity, (e) => e.address, { nullable: true })
  servePartner!: ServePartnerEntity;

  @OneToOne(() => ProjectEntity, (e) => e.address, { nullable: true })
  project!: ProjectEntity;

  @OneToOne(() => EpApplicationEntity, (e) => e.address, { nullable: true })
  epApplication!: EpApplicationEntity;

  @OneToOne(() => SpApplicationEntity, (e) => e.address, { nullable: true })
  spApplication!: SpApplicationEntity;
}
