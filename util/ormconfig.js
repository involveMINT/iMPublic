module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['libs/**/*.entity.{ts,js}'],
  migrations: ['libs/migration/**/*.{ts,js}'],
  cli: {
    migrationsDir: 'libs/migration',
  },
};