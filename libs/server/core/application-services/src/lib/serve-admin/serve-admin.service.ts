import { ServeAdminRepository } from '@involvemint/server/core/domain-services';
import {
  AddServeAdminDto,
  GetServeAdminsForServePartnerDto,
  RemoveServeAdminDto,
  ServeAdmin,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ServeAdminService {
  constructor(private readonly spAdminRepo: ServeAdminRepository, private readonly auth: AuthService) {}

  async getForServePartner(query: Query<ServeAdmin>, token: string, dto: GetServeAdminsForServePartnerDto) {
    const user = await this.auth.validateUserToken(token, { serveAdmins: { servePartner: { id: true } } });

    const admin = user.serveAdmins.find((sa) => sa.servePartner.id === dto.spId);

    if (!admin) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    return this.spAdminRepo.query(query, { where: { servePartner: dto.spId } });
  }

  async addAdmin(query: Query<ServeAdmin>, token: string, dto: AddServeAdminDto) {
    /** User making the request. */
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true }, superAdmin: true },
    });
    /** Admin making the request. */
    const adminMakingRequest = user.serveAdmins.find((sa) => sa.servePartner.id === dto.spId);

    if (!adminMakingRequest) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    if (!adminMakingRequest.superAdmin) {
      throw new HttpException(`Only a SuperAdmin can add other Admins.`, HttpStatus.UNAUTHORIZED);
    }

    const currentSpAdmins = await this.spAdminRepo.query(
      { user: { id: true } },
      { where: { servePartner: dto.spId } }
    );

    if (currentSpAdmins.some((sa) => sa.user.id === dto.userId)) {
      throw new HttpException('This user is already a ServeAdmin.', HttpStatus.CONFLICT);
    }

    return this.spAdminRepo.upsert(
      {
        id: uuid.v4(),
        superAdmin: false,
        datePermitted: new Date(),
        servePartner: dto.spId,
        user: dto.userId,
      },
      query
    );
  }
  async removeAdmin(query: Query<{ deletedId: true }>, token: string, dto: RemoveServeAdminDto) {
    /** User making the request. */
    const user = await this.auth.validateUserToken(token, {
      serveAdmins: { servePartner: { id: true }, superAdmin: true },
    });
    /** Admin to remove. */
    const adminToRemove = await this.spAdminRepo.findOneOrFail(dto.saId, {
      servePartner: { id: true },
      superAdmin: true,
    });
    /** Admin making the request. */
    const adminMakingRequest = user.serveAdmins.find(
      (sa) => sa.servePartner.id === adminToRemove.servePartner.id
    );

    if (!adminMakingRequest) {
      throw new HttpException('You do not own this ServePartner Profile.', HttpStatus.UNAUTHORIZED);
    }

    if (!adminMakingRequest.superAdmin) {
      throw new HttpException(`Only a SuperAdmin can revoke Admin rights.`, HttpStatus.UNAUTHORIZED);
    }

    if (!adminToRemove) {
      throw new HttpException('This user is not already a ServeAdmin.', HttpStatus.CONFLICT);
    }

    return parseQuery(query, { deletedId: await this.spAdminRepo.delete(dto.saId) });
  }
}
