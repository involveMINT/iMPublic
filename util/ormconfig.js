module.exports = {
  type: 'postgres',
  host: '127.0.0.1', //process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['libs/**/*.entity.ts', 'libs/**/*.view.ts'],
  migrations: ['libs/migration/*.ts'],
  cli: {
    migrationsDir: 'libs/migration'
  },
  synchronize: false,
  logging: false
};
