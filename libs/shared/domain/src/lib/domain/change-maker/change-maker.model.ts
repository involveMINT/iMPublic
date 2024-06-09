import { IOneToMany, IOneToOne } from '../repository';
import { Address } from '../address';
import { Credit } from '../credit';
import { Enrollment } from '../enrollment';
import { Handle } from '../handle';
import { Offer } from '../offer';
import { PassportDocument } from '../passport-document';
import { Request } from '../request';
import { Transaction } from '../transaction';
import { User } from '../user';
import { Voucher } from '../voucher';
import { ChangeMakerView } from './change-maker.view';

export type CmOnboardingState = 'project' | 'market' | 'none' | 'done';

export interface ChangeMaker {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  phone: string;
  dateCreated: Date | string;
  onboardingState: CmOnboardingState;
  profilePicFilePath?: string;

  handle: IOneToOne<Handle, 'changeMaker'>;
  enrollments: IOneToMany<Enrollment, 'changeMaker'>;
  credits: IOneToMany<Credit, 'changeMaker'>;
  address?: IOneToOne<Address, 'changeMaker'>;
  offers: IOneToMany<Offer, 'changeMaker'>;
  requests: IOneToMany<Request, 'changeMaker'>;
  passportDocuments: IOneToMany<PassportDocument, 'changeMaker'>;
  receivingTransactions: IOneToMany<Transaction, 'receiverChangeMaker'>;
  receivingVouchers: IOneToMany<Voucher, 'changeMakerReceiver'>;
  sendingTransactions: IOneToMany<Transaction, 'senderChangeMaker'>;
  user: IOneToOne<User, 'changeMaker'>;
  view: IOneToOne<ChangeMakerView, 'changeMaker'>;
}
