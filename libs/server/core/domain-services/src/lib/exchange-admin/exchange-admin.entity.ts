import { ExchangeAdmin } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { ExchangePartnerEntity } from '../exchange-partner/exchange-partner.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: DbTableNames.ExchangeAdmin })
export class ExchangeAdminEntity implements Required<ExchangeAdmin> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  datePermitted!: Date;

  @Column()
  superAdmin!: boolean;

  @ManyToOne(() => UserEntity, (e) => e.exchangeAdmins)
  user!: UserEntity;

  @ManyToOne(() => ExchangePartnerEntity, (e) => e.admins)
  exchangePartner!: ExchangePartnerEntity;
}
