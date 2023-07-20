import { Env } from './environment.interface';

const host = 'localhost';

/** Develop environment variables. */
export const environment: Env = {
  production: false,
  test: false,
  host,
  apiUrl: `http://${host}:3335`,
  appUrl: `http://${host}:4202`,
  storageBucket: 'involvemint-tech',
  adminPasswordHash:
    'sZfCJx5X3sGSwkokIs9IVFxDfxWd2lEKsAhkOSDfEK8u2YS98y5rJAmXmtrJs7AQ29xkHMmz0bDfLkXCKS9/+A==',
  gcpApiKey: 'AIzaSyBmrVarnXPU9Wfdp07kQSna7Qqa5F1jHDw',
  typeOrmConfig: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '1Qazxsw2',
    database: 'involvemint',
    synchronize: true,
    autoLoadEntities: true,
    ssl: false,
  },
  firebaseEnv: {
    apiKey: 'AIzaSyBmrVarnXPU9Wfdp07kQSna7Qqa5F1jHDw',
    authDomain: 'involvemint-tech.firebaseapp.com',
    databaseURL: 'https://involvemint-tech.firebaseio.com',
    projectId: 'involvemint-tech',
    storageBucket: 'involvemint-tech.appspot.com',
    messagingSenderId: '58069019596',
    appId: '1:58069019596:web:e743232f22300632b84b69',
    measurementId: 'G-1KE5J3JBW7',
  },
  mailgun: {
    apiKey: '',
    domain: '',
  },
  twilio: {
    accountSid: '',
    authToken: '',
    sendingPhone: '',
  },
  gcp: {
    type: 'service_account',
    project_id: 'involvemint-tech',
    private_key_id: '198bde8a228202aa9eb393c3a622eed1f95ca874',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD1fEG+td0dLLKe\nx1ACy6p+86gUHJUu7iHGFMIpI6FG5syF4a1nME4M1yJeNQaB49qODdEsDoH2mMLK\nbimQuMrhn6DKSZHaZvnClRBDhZINFY8luLUic2Tp94BB4P1CvAJCX+Ep1bYb9IR6\n0qbO+Nb8iSmGUNcyH/fI53ts1wWwkBL+ZT91M3H73Xjb6D1zqDrgJvX/MI6hojIz\n8UImhKOJZ9t/p2n+j216dntDfQO0PMVwQGB1qOziZqQgBojyH2ghFQd1y133CjjV\nIUzoP9p4uz7bmgC7KJxP21Tb1XhLa3bcgZqT/LAq8xQV6bdbRpKOke4Dv1Ztpvgf\n3mWDtiylAgMBAAECggEAO/VQfYsf6YtMSVm3Iieqif1rNRZSHbdOCnpxfejU8GNY\n2u5nEwgKWDqHi2j6IOmNLRsU1uToO1nOYfEMN+vaqcb6V84mUKjMIgmUgllydb2p\nS/ZUT4jNwhOQgQa59P3Es3+FmFk5dJSBcxpWYcEHiYDa4pKGLRj/xVM8ozXVjuz3\nMKw/4arOZxhYdbj373V2ui8i3MaXmKs1DoTLTfGdP1hLLSxzfK+YW6R5kTEEmTbS\nJw4lzVr5bK7tQytbLbxBixSumfnHXeZPdfYT5SesHWnsvkW3uOmVbC8S+2nOsi2P\n3J2OZtSJKcIwM3Spu0/cUx8yHLvIJxTsicHJrqg7QQKBgQD72M/faQQc2goROMRX\nJeEBci17pd8iwyAxD+UBN5yLyXcHnHEUqIp/cl4z11+yubU3nLlyaoAtYm9Gdgmb\nEtYnGlGDpkfnAFRdNn+q4PaE3qYEoRlg980GEKNQCgAcKLBSdUtZiGDytrR/4m4b\nTUn4djtI4Js5uXpEBwhQA8S2cQKBgQD5iJbSWdX+mHdGuPrVxrX/NGbipAOcBRoi\nYO+EXSnmosr2wsS1Xy6TK+v9sy2VphyaWcyteMdew3/FZKHoTiBvdvePqrk6SplN\n+zTNhpTpukrNL2FDCqZRHOfoP5SutTDZnfcdCfZK5DjKQ123Ng5DltW0quhIvBcF\n6AU5bc77dQKBgQCWpXBisQy2vW48MvqvLodTOBsg1W2N+64r6tgPTFal/1LmCJxT\nwSVnauASnogt/ov5whPj7vTRMQpi2YSRcEkNht6voy1rbnUIdOsVKhAMFqq0JjFq\nIZBQSm+GFxVNwsEF8geqfLuRM9zwil9WkXrn1sFLrJ7tfpc2TgaY5kgq4QKBgFgd\nGVTyEBS09fltPHXck0uoz2PcksG3M4FMRYex9ifQ+GamZBu/noyth8mwSbp8S8Fd\nUF85NP2Lf0TOwjVr0RxLICQFHx8sVHIq8Hxat57I/7zwrCGmUxB1apaiTPhcVwGh\nPC9u4x+S81LI8wDM/8ByNMh1SUzVzjNxuNaMpfg5AoGBANwaIhTeTFGOchPAZ6QI\nrJci5gCoFyMJV79s1Ps3QanFDWkrsnaM0o4MVi7+HyYd/QMxcocjB850i2X/+iWo\n+Fyvy0izNXXWT1EDXUg2R29OQSD954doyZ+SGuD2O/OwBCW9ZKf6j9qjIouIM91f\nhnB6BglSo88y1x1QtFyVHUUq\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-k5bmt@involvemint-tech.iam.gserviceaccount.com',
    client_id: '104053853939127292965',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k5bmt%40involvemint-tech.iam.gserviceaccount.com',
  },
  scrypt: {
    memCost: 14,
    rounds: 8,
    saltSeparator: 'Bw==',
    signerKey: 'de/PQ/Gy53mgslvUgDUKDCgHJPArYqbFnGILLQZNe5My/CvqIThVL/CsndU8oudZ9lc4B7PT8w3sAar2/luQxA==',
    // TODO switch
    // signerKey: 'qUmhMeByCl+H+YaT4RlH/kri/BLQEkCRrySxVqrODKR8MIhwU49k3WzyZJtr1R3dgQXDPq+7LUmIs+vuFdp8Nw==',
  },
};