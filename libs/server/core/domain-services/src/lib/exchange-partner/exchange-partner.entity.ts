import {
  defaultStorefrontListingStatus,
  EpOnboardingState,
  ExchangePartner,
  StorefrontListingStatus,
} from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { CreditEntity } from '../credit/credit.entity';
import { DbTableNames } from '../db-table-names';
import { ExchangeAdminEntity } from '../exchange-admin/exchange-admin.entity';
import { HandleEntity } from '../handle/handle.entity';
import { OfferEntity } from '../offer/offer.entity';
import { RequestEntity } from '../request/request.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { VoucherEntity } from '../voucher/voucher.entity';
import { ExchangePartnerViewEntity } from './exchange-partner.view';

@Entity({ name: DbTableNames.ExchangePartner })
export class ExchangePartnerEntity implements Required<ExchangePartner> {
  @PrimaryColumn('text')
  id!: string;
  @Column()
  name!: string;
  @Column({ nullable: true })
  description!: string;
  @Column({ nullable: true })
  logoFilePath!: string;
  @Column()
  website!: string;
  @Column()
  phone!: string;
  @Column()
  email!: string;
  @Column()
  ein!: string;
  @Column('text', { array: true, default: '{}' })
  imagesFilePaths!: string[];
  @Column('text', { default: defaultStorefrontListingStatus })
  listStoreFront!: StorefrontListingStatus;
  @Column()
  budgetEndDate!: Date;
  @Column()
  budget!: number;
  @Column({ nullable: true, type: 'float8' })
  latitude!: number;
  @Column({ nullable: true, type: 'float8' })
  longitude!: number;
  @Column({ default: 'NOW()' })
  dateCreated!: Date;
  @Column('text', { default: EpOnboardingState.profile })
  onboardingState!: EpOnboardingState;
  @Column('simple-array', { default: '' })
  tags: string[] = [];  
  @Column('text', {default: ''})
  spendingOptions!: string;

  @OneToOne(() => HandleEntity, (e) => e.exchangePartner, { cascade: true })
  @JoinColumn()
  handle!: HandleEntity;
  @OneToOne(() => AddressEntity, (e) => e.exchangePartner, { cascade: true })
  @JoinColumn()
  address!: AddressEntity;
  @OneToMany(() => OfferEntity, (e) => e.exchangePartner, { cascade: true })
  offers!: OfferEntity[];
  @OneToMany(() => RequestEntity, (e) => e.exchangePartner, { cascade: true })
  requests!: RequestEntity[];
  @OneToMany(() => ExchangeAdminEntity, (e) => e.exchangePartner, { cascade: true })
  admins!: ExchangeAdminEntity[];
  @OneToMany(() => CreditEntity, (e) => e.exchangePartner)
  credits!: CreditEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.senderExchangePartner)
  sendingTransactions!: TransactionEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.receiverExchangePartner)
  receivingTransactions!: TransactionEntity[];

  @OneToMany(() => VoucherEntity, (s) => s.seller)
  sendingVouchers!: VoucherEntity[];
  @OneToMany(() => VoucherEntity, (s) => s.exchangePartnerReceiver)
  receivingVouchers!: VoucherEntity[];

  @OneToOne(() => ExchangePartnerViewEntity, (s) => s.exchangePartner)
  view!: ExchangePartnerViewEntity;
}
