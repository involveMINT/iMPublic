import { EpApplication } from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { DbTableNames } from '../db-table-names';
import { HandleEntity } from '../handle/handle.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: DbTableNames.EpApplication })
export class EpApplicationEntity implements Required<EpApplication> {
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

  @Column()
  ein!: string;

  @Column({ default: () => "now()" })
  dateCreated!: Date;

  @ManyToOne(() => UserEntity, (e) => e.epApplications)
  user!: UserEntity;

  @OneToOne(() => HandleEntity, (e) => e.epApplication, { cascade: true })
  @JoinColumn()
  handle!: HandleEntity;

  @OneToOne(() => AddressEntity, (e) => e.epApplication, { cascade: true })
  @JoinColumn()
  address!: AddressEntity;
}
