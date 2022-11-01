import { EpApplicationService } from '@involvemint/server/core/application-services';
import { EpApplication, IEpApplicationGateway, InvolvemintGateways } from '@involvemint/shared/domain';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { IQuery } from '@orcha/common';
import { IServerGateway, ServerGateway, ServerSubscription } from '@orcha/nestjs';
import { Socket } from 'socket.io';

@ServerGateway(InvolvemintGateways.epApplication)
export class EpApplicationGateway implements IServerGateway<IEpApplicationGateway>, OnGatewayDisconnect {
  constructor(private readonly epApp: EpApplicationService) {}

  handleDisconnect(client: Socket) {
    this.epApp.subs.handleDisconnect(client);
  }

  // TODO https://github.com/nestjs/nest/pull/5975
  @ServerSubscription()
  async subAll(socket: Socket, query: IQuery<EpApplication[]>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.epApp.subs.subAll(socket, 'subAll', (query as any).query, (query as any).dto.token);
  }
}
