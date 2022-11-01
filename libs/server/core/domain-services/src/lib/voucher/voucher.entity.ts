import { Voucher } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { LinkedVoucherOfferEntity } from '../linked-voucher-offers/linked-voucher-offers.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: DbTableNames.Voucher })
export class VoucherEntity implements Required<Voucher> {
  @PrimaryColumn('text')
  id!: string;
  @Column()
  code!: string;
  @Column()
  amount!: number;
  @Column()
  dateCreated!: Date;
  @Column('text', { nullable: true })
  buyerId!: string;
  @Column({ nullable: true })
  dateExpires!: Date;
  @Column({ nullable: true })
  dateRefunded!: Date;
  @Column({ nullable: true })
  dateArchived!: Date;
  @Column({ nullable: true })
  dateRedeemed!: Date;

  @ManyToOne(() => ExchangePartnerEntity, (c) => c.sendingVouchers, { nullable: false })
  seller!: ExchangePartnerEntity;
  @OneToMany(() => LinkedVoucherOfferEntity, (e) => e.voucher, { nullable: false, cascade: true })
  offers!: LinkedVoucherOfferEntity[];
  @ManyToOne(() => ChangeMakerEntity, (e) => e.receivingVouchers, { nullable: true })
  changeMakerReceiver!: ChangeMakerEntity;
  @ManyToOne(() => ServePartnerEntity, (e) => e.receivingVouchers, { nullable: true })
  servePartnerReceiver!: ServePartnerEntity;
  @ManyToOne(() => ExchangePartnerEntity, (e) => e.receivingVouchers, { nullable: true })
  exchangePartnerReceiver!: ExchangePartnerEntity;
}
