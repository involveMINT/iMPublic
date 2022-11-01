import { Handle } from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { HandleEntity } from './handle.entity';

@Injectable()
export class HandleRepository extends IOrchaTypeormRepository<Handle> {
  constructor(@InjectRepository(HandleEntity) protected readonly repo: Repository<Handle>) {
    super(repo);
  }

  /**
   * Discovers if a handle conflict exists based on input handle string.
   * @param handle String to see if this handle already exists.
   */
  async verifyHandleUniqueness(handle: string) {
    const conflictingHandle = await this.findOne(handle);
    if (conflictingHandle) {
      throw new HttpException(`Handle @${conflictingHandle.id} already exists.`, HttpStatus.CONFLICT);
    }
  }
}
