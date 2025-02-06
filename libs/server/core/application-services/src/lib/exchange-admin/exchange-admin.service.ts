import { ExchangeAdminRepository } from '@involvemint/server/core/domain-services';
import {
  AddExchangeAdminDto,
  ExchangeAdmin,
  GetExchangeAdminsForExchangePartnerDto,
  GetSuperAdminForExchangePartnerDto,
  RemoveExchangeAdminDto,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ExchangeAdminService {
  constructor(private readonly epAdminRepo: ExchangeAdminRepository, private readonly auth: AuthService) {}

  async getForExchangePartner(
    query: Query<ExchangeAdmin>,
    token: string,
    dto: GetExchangeAdminsForExchangePartnerDto
  ) {
    await this.auth.authenticateFromProfileId(dto.epId, token);

    return this.epAdminRepo.query(query, { where: { exchangePartner: dto.epId } });
  }

  async getSuperAdminForExchangePartner(
    query: Query<ExchangeAdmin>,
    token: string,
    dto: GetSuperAdminForExchangePartnerDto
  ) {
    const user = await this.auth.validateUserToken(token);
    if (!user.baAdmin) {
      throw new HttpException(`You are not a Business Admin.`, HttpStatus.UNAUTHORIZED);
    }
    const superAdmin = await this.epAdminRepo.query(query, {
      where: { exchangePartner: dto.epId, superAdmin: true },
    });
    if (superAdmin.length !== 1) {
      throw new HttpException(`Cannot find Super Admin for the ExchangePartner`, HttpStatus.NOT_FOUND);
    }
    return superAdmin[0];
  }

  async addAdmin(query: Query<ExchangeAdmin>, token: string, dto: AddExchangeAdminDto) {
    /** User making the request. */
    const user = await this.auth.authenticateFromProfileId(dto.epId, token);

    const currentSpAdmins = await this.epAdminRepo.query(
      { user: { id: true }, superAdmin: true },
      { where: { exchangePartner: dto.epId } }
    );

    /** Admin making the request. */
    const adminMakingRequest = currentSpAdmins.find((ea) => ea.user.id === user.id);

    if (!user.baAdmin && !adminMakingRequest?.superAdmin) {
      throw new HttpException(`Only a SuperAdmin can add other Admins.`, HttpStatus.UNAUTHORIZED);
    }

    if (currentSpAdmins.some((ea) => ea.user.id === dto.userId)) {
      throw new HttpException('This user is already a ExchangeAdmin.', HttpStatus.CONFLICT);
    }

    return this.epAdminRepo.upsert(
      {
        id: uuid.v4(),
        superAdmin: false,
        datePermitted: new Date(),
        exchangePartner: dto.epId,
        user: dto.userId,
      },
      query
    );
  }
  async removeAdmin(query: Query<{ deletedId: true }>, token: string, dto: RemoveExchangeAdminDto) {
    /** Admin to remove. */
    const adminToRemove = await this.epAdminRepo.findOneOrFail(dto.eaId, {
      exchangePartner: { id: true },
      superAdmin: true,
    });

    if (!adminToRemove) {
      throw new HttpException('This user is not an ExchangeAdmin.', HttpStatus.CONFLICT);
    }

    /** User making the request. */
    const user = await this.auth.authenticateFromProfileId(adminToRemove.exchangePartner.id, token);

    /** Admin making the request. */
    const adminMakingRequest = await this.epAdminRepo.query(
      { id: true, superAdmin: true },
      { where: { user: user.id, exchangePartner: adminToRemove.exchangePartner.id } }
    );

    if (!user.baAdmin && !adminMakingRequest[0].superAdmin) {
      throw new HttpException(`Only a SuperAdmin can revoke Admin rights.`, HttpStatus.UNAUTHORIZED);
    }

    return parseQuery(query, { deletedId: await this.epAdminRepo.delete(dto.eaId) });
  }
}
