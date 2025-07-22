import { createConnection } from 'typeorm';

// Load the config using require()
const typeOrmConfig = require('./ormconfig'); 

async function checkPendingMigrations() {
  try {
    const connection = await createConnection(typeOrmConfig);

    const hasPendingMigrations = await connection.showMigrations();

    if (hasPendingMigrations) {
      console.log('⚠️ Pending migrations detected.');
      console.log('MIGRATION_PENDING=true');
    } else {
      console.log('✅ All migrations applied.');
    }

    await connection.close();
  } catch (err: any) {
    console.error('❌ Error checking pending migrations:', err.message);
    process.exit(1);
  }
}

checkPendingMigrations();