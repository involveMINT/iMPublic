import { ServerCoreApplicationServicesModule } from '@involvemint/server/core/application-services';
import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment/enrollment.controller';
import { ChangeMakerController } from './change-maker/change-maker.controller';
import { ChatController } from './chat/chat.controller';
import { CreditController } from './credit/credit.controller';
import { ExchangeAdminController } from './exchange-admin/exchange-admin.controller';
import { EpApplicationController } from './ep-application/ep-application.controller';
import { ExchangePartnerController } from './exchange-partner/exchange-partner.controller';
import { HandleController } from './handle/handle.controller';
import { OfferController } from './offer/offer.controller';
import { PassportDocumentController } from './passport-document/passport-document.controller';
import { PoiController } from './poi/poi.controller';
import { ProjectController } from './project/project.controller';
import { RequestController } from './request/request.controller';
import { ServeAdminController } from './serve-admin/serve-admin.controller';
import { ServePartnerController } from './serve-partner/serve-partner.controller';
import { SpApplicationController } from './sp-application/sp-application.controller';
import { StorageController } from './storage/storage.controller';
import { TransactionController } from './transaction/transaction.controller';
import { UserController } from './user/user.controller';
import { VoucherController } from './voucher/voucher.controller';

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
