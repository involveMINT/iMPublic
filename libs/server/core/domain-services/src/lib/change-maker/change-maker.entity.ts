import { ChangeMaker, CmOnboardingState } from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { CreditEntity } from '../credit/credit.entity';
import { DbTableNames } from '../db-table-names';
import { EnrollmentEntity } from '../enrollment/enrollment.entity';
import { HandleEntity } from '../handle/handle.entity';
import { OfferEntity } from '../offer/offer.entity';
import { PassportDocumentEntity } from '../passport-document/passport-document.entity';
import { RequestEntity } from '../request/request.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { UserEntity } from '../user/user.entity';
import { VoucherEntity } from '../voucher/voucher.entity';
import { ChangeMakerViewEntity } from './change-maker.view';

@Entity({ name: DbTableNames.ChangeMaker })
export class ChangeMakerEntity implements Required<ChangeMaker> {
  @PrimaryColumn('text')
  id!: string;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  @Column({ nullable: true })
  profilePicFilePath!: string;
  @Column({ nullable: true })
  bio!: string;
  @Column()
  phone!: string;
  @Column('text')
  onboardingState!: CmOnboardingState;
  @Column({ default: 'NOW()' })
  dateCreated!: Date;

  @OneToOne(() => HandleEntity, (e) => e.changeMaker, { cascade: true })
  @JoinColumn()
  handle!: HandleEntity;
  @OneToOne(() => AddressEntity, (e) => e.changeMaker, { cascade: true })
  @JoinColumn()
  address!: AddressEntity;
  @OneToOne(() => UserEntity, (e) => e.changeMaker)
  user!: UserEntity;
  @OneToMany(() => EnrollmentEntity, (e) => e.changeMaker)
  enrollments!: EnrollmentEntity[];
  @OneToMany(() => PassportDocumentEntity, (p) => p.changeMaker)
  passportDocuments!: PassportDocumentEntity[];
  @OneToMany(() => CreditEntity, (e) => e.changeMaker)
  credits!: CreditEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.senderChangeMaker)
  sendingTransactions!: TransactionEntity[];
  @OneToMany(() => TransactionEntity, (e) => e.receiverChangeMaker)
  receivingTransactions!: TransactionEntity[];
  @OneToMany(() => OfferEntity, (e) => e.changeMaker, { cascade: true })
  offers!: OfferEntity[];
  @OneToMany(() => RequestEntity, (e) => e.changeMaker, { cascade: true })
  requests!: RequestEntity[];
  @OneToMany(() => VoucherEntity, (e) => e.changeMakerReceiver)
  receivingVouchers!: VoucherEntity[];
  @OneToOne(() => ChangeMakerViewEntity, (s) => s.changeMaker)
  view!: ChangeMakerViewEntity;
}
