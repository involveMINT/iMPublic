import { EpApplicationService } from '@involvemint/server/core/application-services';
import {
  BaSubmitEpApplicationDto,
  BaSubmitEpApplicationQuery,
  EpApplication,
  EpApplicationQuery,
  ExchangePartner,
  IEpApplicationOrchestration,
  InvolvemintOrchestrations,
  ProcessEpApplicationDto,
  SubmitEpApplicationDto,
  UserQuery,
  WithdrawEpApplicationDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.epApplication)
export class EpApplicationOrchestration implements IServerOrchestration<IEpApplicationOrchestration> {
  constructor(private readonly epApp: EpApplicationService) {}

  /*
      _   _             
     | | | |___ ___ _ _ 
     | |_| (_-</ -_) '_|
      \___//__/\___|_|  
                        
  */

  @ServerOperation({ validateQuery: UserQuery.epApplications })
  async submit(query: IQuery<EpApplication>, token: string, dto: SubmitEpApplicationDto) {
    return this.epApp.submit(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  async withdraw(query: IQuery<{ deletedId: string }>, token: string, dto: WithdrawEpApplicationDto) {
    return this.epApp.withdraw(query, token, dto);
  }

  /*
      ___         _                    _      _       _      
     | _ )_  _ __(_)_ _  ___ ______   /_\  __| |_ __ (_)_ _  
     | _ \ || (_-< | ' \/ -_|_-<_-<  / _ \/ _` | '  \| | ' \ 
     |___/\_,_/__/_|_||_\___/__/__/ /_/ \_\__,_|_|_|_|_|_||_|
                                                               
  */

  @ServerOperation({ validateQuery: BaSubmitEpApplicationQuery })
  async baSubmit(query: IQuery<ExchangePartner>, token: string, dto: BaSubmitEpApplicationDto) {
    return this.epApp.baSubmit(query, token, dto);
  }

  /*
        _      _       _      
       /_\  __| |_ __ (_)_ _  
      / _ \/ _` | '  \| | ' \ 
     /_/ \_\__,_|_|_|_|_|_||_|
                              
  */

  @ServerOperation({ validateQuery: { deletedId: true } })
  async process(query: IQuery<{ deletedId: string }>, token: string, dto: ProcessEpApplicationDto) {
    return this.epApp.process(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpApplicationQuery })
  async findAll(query: IQuery<EpApplication>, token: string) {
    return this.epApp.findAll(query, token);
  }
}
