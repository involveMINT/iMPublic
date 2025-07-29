import { ServePartner } from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { CreditEntity } from '../credit/credit.entity';
import { DbTableNames } from '../db-table-names';
import { HandleEntity } from '../handle/handle.entity';
import { OfferEntity } from '../offer/offer.entity';
import { ProjectEntity } from '../project/project.entity';
import { RequestEntity } from '../request/request.entity';
import { ServeAdminEntity } from '../serve-admin/serve-admin.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { VoucherEntity } from '../voucher/voucher.entity';

@Entity({ name: DbTableNames.ServePartner })
export class ServePartnerEntity implements Required<ServePartner> {
  @PrimaryColumn('text')
  id!: string;
  @Column()
  email!: string;
  @Column()
  name!: string;
  @Column()
  phone!: string;
  @Column()
  website!: string;
  @Column({ nullable: true })
  logoFilePath!: string;
  @Column('text', { array: true, default: '{}' })
  imagesFilePaths!: string[];
  @Column({ nullable: true })
  description!: string;
  @Column({ nullable: true, type: 'float8' })
  latitude!: number;
  @Column({ nullable: true, type: 'float8' })
  longitude!: number;
  @Column({ default: () => "now()" })
  dateCreated!: Date;

  @OneToOne(() => HandleEntity, (e) => e.servePartner, { cascade: true })
  @JoinColumn()
  handle!: HandleEntity;
  @OneToOne(() => AddressEntity, (e) => e.servePartner, { cascade: true })
  @JoinColumn()
  address!: AddressEntity;
  @OneToMany(() => ProjectEntity, (e) => e.servePartner, { cascade: true })
  projects!: ProjectEntity[];
  @OneToMany(() => ServeAdminEntity, (e) => e.servePartner, { cascade: true })
  admins!: ServeAdminEntity[];
  @OneToMany(() => CreditEntity, (e) => e.servePartner)
  credits!: CreditEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.senderServePartner)
  sendingTransactions!: TransactionEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.receiverServePartner)
  receivingTransactions!: TransactionEntity[];
  @OneToMany(() => OfferEntity, (e) => e.servePartner, { cascade: true })
  offers!: OfferEntity[];
  @OneToMany(() => RequestEntity, (e) => e.servePartner, { cascade: true })
  requests!: RequestEntity[];
  @OneToMany(() => VoucherEntity, (e) => e.servePartnerReceiver)
  receivingVouchers!: VoucherEntity[];
}
