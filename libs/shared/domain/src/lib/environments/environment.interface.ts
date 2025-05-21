import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FirebaseScryptOptions } from 'firebase-scrypt';
import * as geocoder from 'node-geocoder';

export interface Env {
  environment: 'production' | 'test' | 'local';
  host: string;
  apiUrl: string;
  appUrl: string;
  storageBucket: string;
  adminPasswordHash: string;
  gcpApiKey: string;
  typeOrmConfig: TypeOrmModuleOptions;
  firebaseEnv: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  mailgun: {
    apiKey: string;
    domain: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    sendingPhone: string;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  gcp: object;
  scrypt: FirebaseScryptOptions;
  defaultLocalAddress: geocoder.Entry[];
}
