import { Handle } from '@involvemint/shared/domain';
import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { EpApplicationEntity } from '../ep-application/ep-application.entity';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';
import { SpApplicationEntity } from '../sp-application/sp-application.entity';

@Entity({ name: DbTableNames.Handle })
export class HandleEntity implements Required<Handle> {
  @PrimaryColumn('text')
  id!: string;

  @OneToOne(() => ChangeMakerEntity, (e) => e.handle, { nullable: true })
  changeMaker!: ChangeMakerEntity;

  @OneToOne(() => ExchangePartnerEntity, (e) => e.handle, { nullable: true })
  exchangePartner!: ExchangePartnerEntity;

  @OneToOne(() => ServePartnerEntity, (e) => e.handle, { nullable: true })
  servePartner!: ServePartnerEntity;

  @OneToOne(() => EpApplicationEntity, (e) => e.handle, { nullable: true })
  epApplication!: EpApplicationEntity;

  @OneToOne(() => SpApplicationEntity, (e) => e.handle, { nullable: true })
  spApplication!: SpApplicationEntity;
}
