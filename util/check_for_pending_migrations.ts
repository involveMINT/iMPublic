// check-pending-migrations.ts
import { createConnection } from 'typeorm';

// Load the config using require()
const typeOrmConfig = require('../ormconfig'); // Adjust path if needed

async function checkPendingMigrations() {
  const connection = await createConnection(typeOrmConfig);

  const hasPending = await connection.showMigrations();

  if (hasPending) {
    console.log('⚠️ Pending migrations detected.');
    console.log('MIGRATION_PENDING=true');
  } else {
    console.log('✅ All migrations applied.');
  }

  await connection.close();
}

checkPendingMigrations();
