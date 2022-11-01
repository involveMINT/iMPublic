import { LinkedVoucherOffer } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { OfferEntity } from '../offer/offer.entity';
import { VoucherEntity } from '../voucher/voucher.entity';

@Entity({ name: DbTableNames.LinkedVoucherOffer })
export class LinkedVoucherOfferEntity implements Required<LinkedVoucherOffer> {
  @PrimaryColumn('text')
  id!: string;
  @Column()
  quantity!: number;

  @ManyToOne(() => VoucherEntity, (c) => c.offers)
  voucher!: VoucherEntity;
  @ManyToOne(() => OfferEntity, (c) => c.vouchers)
  offer!: OfferEntity;
}
