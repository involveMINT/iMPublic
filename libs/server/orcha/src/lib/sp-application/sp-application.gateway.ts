/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SpApplicationService } from '@involvemint/server/core/application-services';
import { InvolvemintGateways, ISpApplicationGateway, SpApplication } from '@involvemint/shared/domain';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { IQuery } from '@orcha/common';
import { IServerGateway, ServerGateway, ServerSubscription } from '@orcha/nestjs';
import { Socket } from 'socket.io';

@ServerGateway(InvolvemintGateways.spApplication)
export class SpApplicationGateway implements IServerGateway<ISpApplicationGateway>, OnGatewayDisconnect {
  constructor(private readonly spApp: SpApplicationService) {}

  handleDisconnect(client: Socket) {
    this.spApp.subs.handleDisconnect(client);
  }

  // TODO https://github.com/nestjs/nest/pull/5975
  @ServerSubscription()
  async subAll(socket: Socket, query: IQuery<SpApplication[]>, { token }: any) {
    return this.spApp.subs.subAll(socket, 'subAll', (query as any).query, (query as any).dto.token);
  }
}
