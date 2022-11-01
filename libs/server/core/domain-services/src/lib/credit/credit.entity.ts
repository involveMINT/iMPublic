import { Credit } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { PoiEntity } from '../poi/poi.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: DbTableNames.Credit })
export class CreditEntity implements Required<Credit> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  amount!: number;

  @Column()
  dateMinted!: Date;

  @Column({ default: false })
  escrow!: boolean;

  @ManyToOne(() => PoiEntity, (p) => p.credits, { nullable: true })
  poi!: PoiEntity;

  @ManyToOne(() => ChangeMakerEntity, (e) => e.credits, { nullable: true })
  changeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.credits, { nullable: true })
  servePartner!: ServePartnerEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.credits, { nullable: true })
  exchangePartner!: ExchangePartnerEntity;
}
