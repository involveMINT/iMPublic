import { IOneToMany, IOneToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { EpApplication } from '../ep-application';
import { ExchangeAdmin } from '../exchange-admin';
import { ServeAdmin } from '../serve-admin';
import { SpApplication } from '../sp-application';

export interface User {
  /** `id` is the user's email address. */
  id: string;
  passwordHash: string;
  salt: string;
  dateCreated: Date | string;
  dateLastLoggedIn?: Date | string;
  active: boolean;
  activationHash?: string;
  forgotPasswordHash?: string;
  joyride: boolean;
  baAdmin: boolean;

  changeMaker?: IOneToOne<ChangeMaker, 'user'>;
  serveAdmins: IOneToMany<ServeAdmin, 'user'>;
  exchangeAdmins: IOneToMany<ExchangeAdmin, 'user'>;
  epApplications: IOneToMany<EpApplication, 'user'>;
  spApplications: IOneToMany<SpApplication, 'user'>;
}

export type ISnoopData = User & { token: string };
