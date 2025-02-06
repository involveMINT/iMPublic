import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address/address.entity';
import { ChangeMakerEntity } from './change-maker/change-maker.entity';
import { ChangeMakerRepository } from './change-maker/change-maker.repository';
import { ChangeMakerViewEntity } from './change-maker/change-maker.view';
import { CreditEntity } from './credit/credit.entity';
import { CreditRepository } from './credit/credit.repository';
import { EnrollmentDocumentEntity } from './enrollment-document/enrollment-document.entity';
import { EnrollmentDocumentRepository } from './enrollment-document/enrollment-document.repository';
import { EnrollmentEntity } from './enrollment/enrollment.entity';
import { EnrollmentRepository } from './enrollment/enrollment.repository';
import { EpApplicationEntity } from './ep-application/ep-application.entity';
import { EpApplicationRepository } from './ep-application/ep-application.repository';
import { ExchangeAdminEntity } from './exchange-admin/exchange-admin.entity';
import { ExchangeAdminRepository } from './exchange-admin/exchange-admin.repository';
import { ExchangePartnerEntity } from './exchange-partner/exchange-partner.entity';
import { ExchangePartnerRepository } from './exchange-partner/exchange-partner.repository';
import { ExchangePartnerViewEntity } from './exchange-partner/exchange-partner.view';
import { HandleEntity } from './handle/handle.entity';
import { HandleRepository } from './handle/handle.repository';
import { LinkedVoucherOfferEntity } from './linked-voucher-offers/linked-voucher-offers.entity';
import { LinkedVoucherOfferRepository } from './linked-voucher-offers/linked-voucher-offers.repository';
import { OfferEntity } from './offer/offer.entity';
import { OfferRepository } from './offer/offer.repository';
import { PassportDocumentEntity } from './passport-document/passport-document.entity';
import { PassportDocumentRepository } from './passport-document/passport-document.repository';
import { PoiEntity } from './poi/poi.entity';
import { PoiRepository } from './poi/poi.repository';
import { ProjectDocumentEntity } from './project-document/project-document.entity';
import { ProjectDocumentRepository } from './project-document/project-document.repository';
import { ProjectEntity } from './project/project.entity';
import { ProjectRepository } from './project/project.repository';
import { QuestionAnswerEntity } from './question-answer/question-answer.entity';
import { QuestionAnswerRepository } from './question-answer/question-answer.repository';
import { QuestionEntity } from './question/question.entity';
import { QuestionRepository } from './question/question.repository';
import { RequestEntity } from './request/request.entity';
import { RequestRepository } from './request/request.repository';
import { ServeAdminEntity } from './serve-admin/serve-admin.entity';
import { ServeAdminRepository } from './serve-admin/serve-admin.repository';
import { ServePartnerEntity } from './serve-partner/serve-partner.entity';
import { ServePartnerRepository } from './serve-partner/serve-partner.repository';
import { SpApplicationEntity } from './sp-application/sp-application.entity';
import { SpApplicationRepository } from './sp-application/sp-application.repository';
import { TaskEntity } from './task/task.entity';
import { TaskRepository } from './task/task.repository';
import { TransactionEntity } from './transaction/transaction.entity';
import { TransactionRepository } from './transaction/transaction.repository';
import { UserEntity } from './user/user.entity';
import { UserRepository } from './user/user.repository';
import { VoucherEntity } from './voucher/voucher.entity';
import { VoucherRepository } from './voucher/voucher.repository';
import { UserORMRepository } from './user/userORM.repository';


const entities = TypeOrmModule.forFeature([
  AddressEntity,
  ChangeMakerEntity,
  ChangeMakerViewEntity,
  CreditEntity,
  EnrollmentDocumentEntity,
  EnrollmentEntity,
  EpApplicationEntity,
  ExchangeAdminEntity,
  ExchangePartnerEntity,
  ExchangePartnerViewEntity,
  HandleEntity,
  LinkedVoucherOfferEntity,
  OfferEntity,
  PassportDocumentEntity,
  PoiEntity,
  ProjectDocumentEntity,
  ProjectEntity,
  QuestionAnswerEntity,
  QuestionEntity,
  RequestEntity,
  ServeAdminEntity,
  ServePartnerEntity,
  SpApplicationEntity,
  TaskEntity,
  TransactionEntity,
  UserEntity,
  VoucherEntity,
]);

const repositories: Provider[] = [
  ChangeMakerRepository,
  CreditRepository,
  EnrollmentDocumentRepository,
  EnrollmentRepository,
  EpApplicationRepository,
  ExchangeAdminRepository,
  ExchangePartnerRepository,
  HandleRepository,
  LinkedVoucherOfferRepository,
  OfferRepository,
  PassportDocumentRepository,
  PoiRepository,
  ProjectDocumentRepository,
  ProjectRepository,
  QuestionAnswerRepository,
  QuestionRepository,
  RequestRepository,
  ServeAdminRepository,
  ServePartnerRepository,
  SpApplicationRepository,
  TaskRepository,
  TransactionRepository,
  UserRepository,
  VoucherRepository,
  UserORMRepository,
];

@Module({
  imports: [entities],
  providers: repositories,
  exports: repositories,
})
export class ServerCoreDomainServicesModule {}
