import { ServerCoreApplicationServicesModule } from '@involvemint/server/core/application-services';
import { Module } from '@nestjs/common';
import { EnrollmentController } from './api/enrollment/enrollment.controller';
import { ChangeMakerController } from './api/change-maker/change-maker.controller';
import { ChatController } from './api/chat/chat.controller';
import { CreditController } from './api/credit/credit.controller';
import { ExchangeAdminController } from './api/exchange-admin/exchange-admin.controller';
import { EpApplicationController } from './api/ep-application/ep-application.controller';
import { ExchangePartnerController } from './api/exchange-partner/exchange-partner.controller';
import { HandleController } from './api/handle/handle.controller';
import { OfferController } from './api/offer/offer.controller';
import { PassportDocumentController } from './api/passport-document/passport-document.controller';
import { PoiController } from './api/poi/poi.controller';
import { ProjectController } from './api/project/project.controller';
import { RequestController } from './api/request/request.controller';
import { ServeAdminController } from './api/serve-admin/serve-admin.controller';
import { ServePartnerController } from './api/serve-partner/serve-partner.controller';
import { SpApplicationController } from './api/sp-application/sp-application.controller';
import { StorageController } from './api/storage/storage.controller';
import { TransactionController } from './api/transaction/transaction.controller';
import { UserController } from './api/user/user.controller';
import { VoucherController } from './api/voucher/voucher.controller';

@Module({
  imports: [
    ServerCoreApplicationServicesModule,
  ],
  controllers: [
    EnrollmentController,
    ChangeMakerController,
    ChatController,
    CreditController,
    ExchangeAdminController,
    EpApplicationController,
    ExchangePartnerController,
    HandleController,
    OfferController,
    PassportDocumentController,
    PoiController,
    ProjectController,
    RequestController,
    ServeAdminController,
    ServePartnerController,
    SpApplicationController,
    StorageController,
    TransactionController,
    UserController,
    VoucherController
  ]
})
export class ServerAPIModule {}
