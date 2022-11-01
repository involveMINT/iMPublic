import { SpApplicationService } from '@involvemint/server/core/application-services';
import {
  InvolvemintOrchestrations,
  ISpApplicationOrchestration,
  ProcessSpApplicationDto,
  SpApplication,
  SpApplicationQuery,
  SubmitSpApplicationDto,
  UserQuery,
  WithdrawSpApplicationDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.spApplication)
export class SpApplicationOrchestration implements IServerOrchestration<ISpApplicationOrchestration> {
  constructor(private readonly spApp: SpApplicationService) {}

  /*
      _   _             
     | | | |___ ___ _ _ 
     | |_| (_-</ -_) '_|
      \___//__/\___|_|  
                        
  */

  @ServerOperation({ validateQuery: UserQuery.spApplications })
  async submit(query: IQuery<SpApplication>, token: string, dto: SubmitSpApplicationDto) {
    return this.spApp.submit(query, dto, token);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  async withdraw(query: IQuery<{ deletedId: string }>, token: string, dto: WithdrawSpApplicationDto) {
    return this.spApp.withdraw(query, token, dto);
  }

  /*
        _      _       _      
       /_\  __| |_ __ (_)_ _  
      / _ \/ _` | '  \| | ' \ 
     /_/ \_\__,_|_|_|_|_|_||_|
                              
  */

  @ServerOperation({ validateQuery: { deletedId: true } })
  async process(query: IQuery<{ deletedId: string }>, token: string, dto: ProcessSpApplicationDto) {
    return this.spApp.process(query, dto, token);
  }

  @ServerOperation({ validateQuery: SpApplicationQuery })
  async findAll(query: IQuery<SpApplication>, token: string) {
    return this.spApp.findAll(query, token);
  }
}
