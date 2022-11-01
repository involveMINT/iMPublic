import { SpApplication } from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { DbTableNames } from '../db-table-names';
import { HandleEntity } from '../handle/handle.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: DbTableNames.SpApplication })
export class SpApplicationEntity implements Required<SpApplication> {
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

  @Column({ default: 'NOW()' })
  dateCreated!: Date;

  @ManyToOne(() => UserEntity, (e) => e.spApplications)
  user!: UserEntity;

  @OneToOne(() => HandleEntity, (e) => e.spApplication, { cascade: true })
  @JoinColumn()
  handle!: HandleEntity;

  @OneToOne(() => AddressEntity, (e) => e.spApplication, { cascade: true })
  @JoinColumn()
  address!: AddressEntity;
}
