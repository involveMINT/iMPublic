import { Env } from './environment.interface';

const host = 'localhost';

/** Develop environment variables. */
export const environment: Env = {
  environment: 'local',
  host,
  apiUrl: `http://${host}:3335`,
  appUrl: `http://${host}:4202`,
  storageBucket: 'your storage bucket',
  adminPasswordHash:
    'sZfCJx5X3sGSwkokIs9IVFxDfxWd2lEKsAhkOSDfEK8u2YS98y5rJAmXmtrJs7AQ29xkHMmz0bDfLkXCKS9/+A==',
  gcpApiKey: 'insert your key here',
  typeOrmConfig: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'involvemint',
    synchronize: true,
    autoLoadEntities: true,
    ssl: false,
  },
  firebaseEnv: {
    apiKey: 'insert your key here',
    authDomain: 'firebase auth domain',
    databaseURL: '',
    projectId: 'your project id',
    storageBucket: 'Your project storage bucket', //your-something.appspot.com
    messagingSenderId: '',
    appId: 'your app id',
    measurementId: 'Your measurementId',
  },
  // mailgun and twilio are optional
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
    project_id: 'impublic-dfg',
    private_key_id: '0f9f82b1e915f2930ed54b7164437b0cb6d8e394',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9n1MrmOsPNXY9\nYEESOmgyMePCgK6PBoCG6l5qN8x6mftXLlUpM8chxOG0hwkjVQhmT9BvWxsfPJ0E\nhI/rCbzBQP/+61SIEX6iJhzBdFtCRnl8I85dveCW8eCUvg0Cf6piVUgYs5GVOdOn\noZ+CrHwxerkGo00Ga0aY5nWTzsICkD/7Nzaf5yWKyxP2qYDYTGhFWW8gVWuZfG3L\nBm2ydfeX5aiAzApqGLxinYQcoE6mEyZ6Mn3dViOBDgs69L8hCGqlJNGeT8ExLv+V\nGUTZg3NabLyrLVRh/Axyf16eIRlDTW/RO91iVxekfGKDSN5LaUxLXH3yj18+/zEF\njGgz2Wa5AgMBAAECggEAA8HM4Y/BlIcQJS4ri+NpXhk79IYdL0tHL6UkIsGhRQqY\n/sS1vj++4c3nVO7aAP+1z2UkcZhiBK/sQoMn4NXMDh4uFExwW9PQ6QCNUE3wYvNH\ng+ynsZbKBOOc+gV794E1DIa5C3g/WbAQIAGlSe8F9OsEEHwa0hY9C1mBmeCeWnOd\nfWtKAJ69H/BhwE3Y3xD5bZ9z43kQCPuHPIS4BACKBHKFNbVQ0EXSC77J5ncoQham\nSUI4+Nj03SO3AvrcUtDg30g0aBSC8VdXk2ME0UR5tFr4IA/Br3CIEaiH0pcSm4Ah\nlGN8WZhf7ox7LQHD35vSropC1FrGh5b81Ig2wjrpGwKBgQDghH+NE7dKvxMWGUUc\nnWBzjBpAb7wTwNEGZ1Ser6/3xfIA2jqmkZHacjxZTVBz3DeDMOz7IUfdDJ3POih0\nmlnbkN34mCJXyLtt27xEGHG89h/J/Nira39VN/VuKhGIpKsHwx1lpphj4tL6T1as\nw1499pmG8G3IWyCYvn05H5emowKBgQDYNjG2xkx95x8QXD04+QFZDdkOXy94wvhy\nUnPlioA0Q8x9URkftn3yrw6ITsIoatl+b+lMHC5FQMT6tTdIt4kQLmJQJT6obTm4\n0DbQZVYhFWf2IALkdrDcQWtiey3J4KH/EY5m9amzR1jTpv68cujLB/uSosnIGxF5\ntyF2KbZ+8wKBgQC3qUvaMTWwbIwFeNiDZu4et45GBeE523JiJacgRKHTM1cbgWmX\nFt/UbbyWZNuaW5wBssU5TelGl2qEuZOchyNYrLIYCQOXAfrpDGZ+4eww4rnwdukb\nmU1JfgREgR9kwyexqtfibpycoVFrN/m0TAFM+OxwaT+1NW595N31G7XntwKBgGXF\nHKFrtZWNtJF+2VJ34qqIWiLpqu6s10T4ipUBHFd9kkNqaOkEfUQ+IhkG+V0M7lMV\nWjr5CM6QLifUJLGVsm5rZttSrKuavhC/8Q0mpePsr4KqjrH7LESAhotUb7kWgyoM\nmXrdJ4O7kZQOhtktPWZT25aqCVCnbRJdoOJ9v+kBAoGAJJM6kzmiLWXJfBfY5DmU\nUuQAMj8/DHAVpEw84fmMg7kybnn7xdGWWuDLn71n3SuhpLHbVBX9KtfjK/PIj6+E\nMqY8uw8ywll6C+qHnMxHn3hRRddXYR36vY19BiP9Rc4cBWCY0wLWogbHdrwUdHVK\n9/siTbzgH/z5cVjCgFvBy6c=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-oqx9q@impublic-dfg.iam.gserviceaccount.com',
    client_id: '114624091960269107642',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-oqx9q%40impublic-dfg.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  },
  // I don't think this is used
  scrypt: {
    memCost: 14,
    rounds: 8,
    saltSeparator: 'Bw==',
    signerKey: 'de/PQ/Gy53mgslvUgDUKDCgHJPArYqbFnGILLQZNe5My/CvqIThVL/CsndU8oudZ9lc4B7PT8w3sAar2/luQxA==',
  },
  defaultLocalAddress: [
    {
      streetNumber: '5000',
      streetName: 'Forbes Ave',
      formattedAddress: '5000 Forbes Ave, Pittsburgh, PA 15213',
      city: 'Pittsburgh',
      administrativeLevels: {
        level1short: 'PA',
      },
      zipcode: '15213',
      latitude: 40.444229,
      longitude: -79.943367,
    },
  ],
};
