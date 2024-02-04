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
    project_id: 'involvemint-12b73',
    private_key_id: 'b9dc531cdcdcae3a9fdaca8050caa0d572af836a',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCX+2WPhmQpIu3D\n7SOs7rE+eCD0fLiwylUTw2aj/VVYA7ZedtM2AExQVWydt/q2DTXWl3Duvd5F6qES\n9YSvfuin8d3n+7mGFTywXXGit9XVS8YgeP84x5dhSq1N3B4aktOZBbzdnw+mTSnw\nN3Jl4JxYoSlqTyJsK4v+3g8ybwP1q2l3SDcIx3d4rnHDlhv9q/voyz1V+cTtVlAr\nxiCghYUaB6PZaAklNaLuUEjsg8dGTq5u4E9ETsv7kxmVI61KYSDL2ZTUq/BRPM93\nTrVpZBPHP/AFWsC7PPOUCnTCBlerfrjPdWKgjChkS/3LwyeOip8VNe3w4pzqmCar\n6yeh42FdAgMBAAECggEASoDbzZsE+MF9qyFR7tFoJAaBqTiG1WuqfzC33UYwEyBm\nwzIe4gcNYgguYbax+ZLKRLMiknaTQtT9Ny0SaXGeHc5MiQ92aAt7H73/GdRix9gI\nfRyziKMXS4NvJ47zVvWJMyeD6WSzKEQFfhPASb7tBemjQtEeP8atLziuXHvdhg1K\ndpXR+l2pwKB/5kc0MtkzHKpWOfpqDztnT5ZRiUdBWBPRatKh3h0GcjP8D/8EscLy\ndN5a2/xQa+o2kbaV3rMRhKoV190N93a8Gc3eAvH/L72XAP2bEVNH+uFqrzFkiU6b\n4bIoj37yQ+CmdX/fTkozx5Pu2l5xKT7R4r8HYoVAJQKBgQDVyhPX3h3uJ/iixGTZ\nFZki+tenjldqC8FvB7BZEPZocxm46hmSyhNVZYy+mmy8ouw0aOXL40ysxdjW0aQD\nEu667n5bbbPNO7IvyEjWqu/AAHU3Rsc470xUS8gAm39Dv8Q/Y1qlte4A2xGx79OL\nbmq9RJ9kjRR+2RbLzJgEHSYIRwKBgQC1/UjUfdS/eVjOM6fHd8/dk32tifxZe0el\nSFgZbltBuey38Kca4Y2qD6o9FValyMRl9eBAaPWXpmlKT3AlVWyknBtCDmjZ3+KE\ntuNSGH0v4Y83Qv1p7HrhCTf2e/7uq8n8uxAQ9jEZ5UVmzIvhFR/HJ4Rv4376swIr\nsfAE4jo/OwKBgGF9BbFxUxqv1Xx7rDUl2TAPTNnWWdw8whdcXTkwN/0HR5p//etn\nBIvzg8vC5YTbknSPxQJFg0hh6/CBppXUQ1KwwKP2kYAsEaQiY7yoNC3Mx6bOOrim\nvprN98T3I4CEaPwy1TotjPuM6jPG1iOF1Vy7dyfGAauaWP/UKxntJNOvAoGAQRn+\nN6VbubMbBYiM+Fnvzf+48Z9u2kOzeXjLqy1DD9wGxjYcUQ1ms/MunvNHL78GIsM2\nGVRypnEtMRwBrhlE6A2/4n1tHKNuULNr1i5UehBiPw6DwKSLwHyfvFjW9WIWu4Xf\nVXH8VpshnIiHcVkxKPkF81CaV+w5VpAsoFKdK4kCgYEAhpcukI5hqGZTtgivbQia\n3qq8Ckv2Jb0Og9Y2inQhlJLyiShUuG6MLBNmL4qR6rNd/dy6aRZCLaKuaAiUGWe9\nNYG9Gx2iY6yoPIRIZbaD+2U1ISsHIhz4neEZj5cUQ/iIvK6IIANoIE5b0/K7QyT1\nN+FzuvCL4tKQO8nX+V52uvw=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-6gkpz@involvemint-12b73.iam.gserviceaccount.com',
    client_id: '103182991487272429065',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6gkpz%40involvemint-12b73.iam.gserviceaccount.com',
    universe_domain: "googleapis.com"
  },
  // I don't think this is used
  scrypt: {
    memCost: 14,
    rounds: 8,
    saltSeparator: 'Bw==',
    signerKey: 'de/PQ/Gy53mgslvUgDUKDCgHJPArYqbFnGILLQZNe5My/CvqIThVL/CsndU8oudZ9lc4B7PT8w3sAar2/luQxA==',
  },
  defaultLocalAddress: [{
    streetNumber: '5000',
    streetName: 'Forbes Ave',
    formattedAddress: '5000 Forbes Ave, Pittsburgh, PA 15213',
    city: 'Pittsburgh',
    administrativeLevels: {
      level1short: 'PA'
    },
    zipcode: '15213',
    latitude: 40.444229,
    longitude: -79.943367
  }] 
};
