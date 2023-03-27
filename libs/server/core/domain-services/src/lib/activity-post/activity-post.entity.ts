import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { DbTableNames } from "../db-table-names";
import { ActivityPost } from '@involvemint/shared/domain';
import { UserEntity } from '../user/user.entity';
import { PoiEntity } from '../poi/poi.entity';
import { LikeEntity } from '../like/like.entity';
import { CommentEntity } from '../comment/comment.entity';


@Entity({ name: DbTableNames.ActivityPost })
export class ActivityPostEntity implements Required<ActivityPost> {
    @PrimaryColumn('text')
    id!: string;

    @Column()
    likeCount!: number;

    @OneToOne(() => PoiEntity, (e) => e.activityPost, { cascade: true, nullable: false })
    @JoinColumn()
    poi!: PoiEntity;

    @ManyToOne(() => UserEntity, (e) => e.activityPosts)
    user!: UserEntity;

    @OneToMany(() => LikeEntity, (e) => e.activityPost)
    likes!: LikeEntity[];

    @OneToMany(() => CommentEntity, (e) => e.activityPost)
    comments!: CommentEntity[];

    @Column()
    dateCreated!: Date;

    @Column()
    enabled!: boolean;
}
