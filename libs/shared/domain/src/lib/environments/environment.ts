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
    project_id: 'involvemint-bdb3f',
    private_key_id: '007e0f8d430359668a67515a3235faa62096e93d',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6OjE2Cx53/c/J\nsAjOaOkDpbBIV3g5UVf8XatSPAduTY//A/vzQRrwhEYYZHVEHYN/w/9rxDe1CuaH\ncrDsArbTpRSMl5bV87JVzKLmIw6zW1wsGE+1AWG+n4Q7ZFapkrqt9D1084b6IlJV\nilZzx0UVCV6U5GRkQeSuTTm2sc9jOSttZuozdBMXlMxF6q//eFIbdGvmcXxKarvU\nFMiJtLyniEjWFETnkspqBFP6tfg42uivW/h8dncWZ2MldESnNwXndLBwaFlqrVsm\nQXwXWz3toKKcPqCj9gJgTIgryf60riwLK8nyoC8xHvIR/jaybf7dIMW8BbkzzLzi\ndBIxv1vDAgMBAAECggEASzKXT4LS5VH8dy0ZiTusp7fehH+pgL+bf0DVnqm1uHEi\nba/Oq43FEoze/xeFkKE4Sb27pGkBs524s8X4sfxwlerJbvIBStiSUPoGZ1aNp5gD\nEp0ohmcN8JraGt9r7SJeNkLzFAgIH3X/eCIZwbub5iA37HiDH0bKUCXH4cFQBHjP\ncJVd5/fW4RMT2xjvkEFLmCs0x8JIPJcw0fp9fhrYcK9XWaG8wM5o0/T3cu+UxXSe\nL8lh9OTIiDawmpBimYlw++iwFuWHyXxrd7JK2VxEzbNbGyfavFKGSU4sZzHxbCcZ\nO38fwAyndKJl2Q7MuvmeCixnFijIH6dtU6vrlUC4AQKBgQDfwJYgg9YeiUVpllQ5\nNjcOOt/6UN8Ep/U0h9pnipZGm2tOO+7eIVQbUEOiAR5IgEF47XwrchYM/ZuJA70c\n0CFlHOu3yrcfeWbJduBAy60yXPd4whzBt34kiPDiR+yUK3JVrH2SMNk7AfhpExSa\nBEOTKeqJIMm9qzDK0WeyXv1IAQKBgQDVERwLZDGRWlklnTbuCDLAT3ivfJMezpxO\ncF7uZqYErRN26NJLue756dh/jnwpqGHpuCz4dVErXiZWOTaF2FnxjbIKfpDbOiQM\nhoP9IYVOwQrSRWeEhXDXqBQDIZ+Q8wygQRXSHRpIdqjyTJw78M8u2/ywse4aB9UV\nXqwtMvmDwwKBgAe0qTbrc2dP0O0m+TWTMWgzDN2hBV0yr5Yki5f/RNefqJ1kIQDT\nYwMhy4J7yWAz0o1omFsirbG61i1szIl+fXfu/AszVwUleC2+A1EX8poGa5tkC/t7\n50M42Bri4TnlGSXsL9LmDcUjdzufJZl8Rht+WQ5p66i1iZOijJCvBsgBAoGAf1u4\nzb5YOrAstWUiHmpcG8PlOdBXCIUrvV9B/3LwLb9e8Sb9/THo/Q2g0a5T3Xq+/DuQ\n9fr6R9gBRmzwgFTwfojaMZex8rjwL2SApOBSlN6jH0lJNVemOeJIBA8nGDeQBoKh\nDnVC7qmvFxZgFRw+W543j07sKjcgUaPDe0kLCI0CgYAf3QEWu8JU//oEpp0FqzoO\nJym/QrIWmGZfKTvZbSJJAmdYz7Nvt1jgPVs3GRVbCI0byX3N3PpciEQmR7e1bfnO\nbbyNxQ+XAxFwrPzadAS4OV9398fxflkS6FKYBIwcH9vrUBhUhPYL2bW8e7gGZmYi\njSlT3T9YenpY/dHTvs61Og==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-i9j1x@involvemint-bdb3f.iam.gserviceaccount.com',
    client_id: '114046529290285846144',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i9j1x%40involvemint-bdb3f.iam.gserviceaccount.com',
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
