import { ServeAdmin } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: DbTableNames.ServeAdmin })
export class ServeAdminEntity implements Required<ServeAdmin> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  datePermitted!: Date;

  @Column()
  superAdmin!: boolean;

  @ManyToOne(() => UserEntity, (e) => e.exchangeAdmins)
  user!: UserEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.admins)
  servePartner!: ServePartnerEntity;
}
