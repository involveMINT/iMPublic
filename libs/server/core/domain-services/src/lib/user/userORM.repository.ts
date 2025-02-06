
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createTypeormRelationsArray } from '../repository/relations.transform';
import { IProps, IUpdateEntity, parseQuery } from '@involvemint/shared/domain';

@Injectable()

export class UserORMRepository extends Repository<UserEntity> {
   constructor(@InjectRepository(UserEntity) protected readonly repo: Repository<UserEntity>) {
       super();
     }

     async findById(id: string): Promise<UserEntity> {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
      }
    
 async GetfindOne(id: number|string, query?:any) {
 
    if (query) {
      const relations = createTypeormRelationsArray(query);
      const dbRes = await this.repo.findOne(id, { relations });
      return parseQuery(query, dbRes);
    } else {
      return this.repo.findOne(id) as unknown as any ;
    }
  }

  // async updateData(
  //     id: string | number,
  //     entity: IUpdateEntity<Entity>,
  //     query?: any
  //   ) {
  //     await this.repo.save({ ...(entity as unknown as DeepPartial<Entity>), id });
  //     this.gatewaysStorage.trigger(id);
  //     return query ? this.findOneOrFail(id, query) : this.findOneOrFail(id);
  //   }
    

      
}