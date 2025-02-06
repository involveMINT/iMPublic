import { Poi, IParser, IProps, Query, ExactQuery} from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { In, Repository } from 'typeorm';
import { EnrollmentRepository } from '../enrollment/enrollment.repository';
import { PoiEntity } from './poi.entity';

@Injectable()
export class PoiRepository extends IBaseRepository<Poi> {
  constructor(
    @InjectRepository(PoiEntity) protected readonly repo: Repository<Poi>,
    private readonly enrollmentRepo: EnrollmentRepository
  ) {
    super(repo);
  }

  async findPoisByCm(cmId: string): Promise<IProps<Poi>[]>;
  async findPoisByCm<Q extends Query<Poi[]>>(
    cmId: string,
    query: ExactQuery<Poi, Q>
  ): Promise<IParser<Poi[], Q>>;
  async findPoisByCm<Q extends Query<Poi[]>>(
    cmId: string,
    query?: ExactQuery<Poi, Q>
  ): Promise<IProps<Poi>[] | IParser<Poi[], Q>> {
    /* Workaround for nested where clause. */
    const enrollments = await this.enrollmentRepo.query(
      { id: true },
      { where: { changeMaker: { id: cmId } } }
    );
    return query
      ? this.query(query, {
          where: { enrollment: In(enrollments.map((e) => e.id)) },
          order: { dateCreated: 'DESC' },
        })
      : this.repo.find({
          where: { enrollment: In(enrollments.map((e) => e.id)) },
          order: { dateCreated: 'DESC' },
        });
  }

  async findPoisByProject(projectId: string): Promise<IProps<Poi>[]>;
  async findPoisByProject<Q extends Query<Poi[]>>(
    projectId: string,
    query: ExactQuery<Poi, Q>
  ): Promise<IParser<Poi[], Q>>;
  async findPoisByProject<Q extends Query<Poi[]>>(
    projectId: string,
    query?: ExactQuery<Poi, Q>
  ): Promise<IProps<Poi>[] | IParser<Poi[], Q>> {
    /* Workaround for nested where clause. */
    const enrollments = await this.enrollmentRepo.query(
      { id: true },
      { where: { project: { id: projectId } } }
    );
    return query
      ? this.query(query, {
          where: { enrollment: In(enrollments.map((e) => e.id)) },
        })
      : this.repo.find({
          where: { enrollment: In(enrollments.map((e) => e.id)) },
        });
  }
}
