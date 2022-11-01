import { Transaction } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: DbTableNames.Transaction })
export class TransactionEntity implements Required<Transaction> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  dateTransacted!: Date;

  @Column()
  amount!: number;

  @Column()
  memo!: string;

  @Column({ nullable: true })
  epAudibleCode!: string;

  // @OneToMany(() => CreditEntity, e => e.)
  // credits!: CreditEntity[];

  @ManyToOne(() => ChangeMakerEntity, (e) => e.sendingTransactions, { nullable: true })
  senderChangeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.sendingTransactions, { nullable: true })
  senderServePartner!: ServePartnerEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.sendingTransactions, { nullable: true })
  senderExchangePartner!: ExchangePartnerEntity;

  @ManyToOne(() => ChangeMakerEntity, (e) => e.receivingTransactions, { nullable: true })
  receiverChangeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.receivingTransactions, { nullable: true })
  receiverServePartner!: ServePartnerEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.receivingTransactions, { nullable: true })
  receiverExchangePartner!: ExchangePartnerEntity;
}
