import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { Comment } from '@involvemint/shared/domain'
import { ActivityPostEntity } from '../activity-post/activity-post.entity';
import { UserEntity } from '../user/user.entity';


@Entity({ name: DbTableNames.Comment })
export class CommentEntity implements Required<Comment> {
    @PrimaryColumn('text')
    id!: string;

    @Column()
    text!: string;

    @ManyToOne(() => ActivityPostEntity, (e) => e.comments)
    activityPost!: ActivityPostEntity;

    @ManyToOne(() => UserEntity, (e) => e.comments)
    user!: UserEntity;

    @Column()
    dateCreated!: Date;

    @Column()
    hidden!: boolean;
}
