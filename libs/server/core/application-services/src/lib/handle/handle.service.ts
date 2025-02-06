import { HandleRepository } from '@involvemint/server/core/domain-services';
import { 
  GenericHandleSearchDto, 
  Handle, 
  SearchHandleDto, 
  ViewProfileDto,
  Query
} from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { Raw } from 'typeorm';

@Injectable()
export class HandleService {
  constructor(private readonly handleRepo: HandleRepository) {}

  async verifyHandle(handle: string): Promise<boolean> {
    const handles = await this.handleRepo.query(
      { id: true },
      { where: { id: Raw((alias) => `${alias} ILIKE '%${handle}%'`) } }
    );
    return handles.length === 0;
  }

  async searchHandles(query: Query<Handle>, dto: SearchHandleDto) {
    return this.handleRepo.query(query, {
      where: { id: Raw((alias) => `${alias} ILIKE '%${dto.handleSearchString}%'`) },
    });
  }

  async viewProfile(query: Query<Handle[]>, dto: ViewProfileDto) {
    return this.handleRepo.findOneOrFail(dto.handle, query);
  }

  async genericSearch(query: Query<Handle[]>, dto: GenericHandleSearchDto) {
    const q = Raw((alias) => `${alias} ILIKE '%${dto.search}%'`);
    return this.handleRepo.query(query, {
      where: [
        {
          id: q,
        },
        query.changeMaker?.firstName
          ? {
              changeMaker: {
                firstName: q,
              },
            }
          : {},
        query.changeMaker?.lastName
          ? {
              changeMaker: {
                lastName: q,
              },
            }
          : {},
        query.servePartner?.name
          ? {
              servePartner: {
                name: q,
              },
            }
          : {},
        query.servePartner?.email
          ? {
              servePartner: {
                email: q,
              },
            }
          : {},
        query.exchangePartner?.name
          ? {
              exchangePartner: {
                name: q,
              },
            }
          : {},
        query.exchangePartner?.email
          ? {
              exchangePartner: {
                email: q,
              },
            }
          : {},
      ],
    });
  }
}
