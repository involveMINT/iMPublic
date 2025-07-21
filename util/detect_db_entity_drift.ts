import { execSync } from 'child_process';
import * as fs from 'fs';

async function checkMigrationDrift() {
  const MIGRATION_PATH = 'src/migration';
  const before = fs.readdirSync(MIGRATION_PATH);

  try {
    execSync(`npx typeorm migration:generate -n DriftCheck --pretty`, {
      stdio: 'ignore',
    });

    const after = fs.readdirSync(MIGRATION_PATH);
    const newFiles = after.filter((f) => !before.includes(f));

    if (newFiles.length > 0) {
      console.log('📈 Schema drift detected. New migration generated.');
      console.log('MIGRATION_NEEDED=true');
    } else {
      console.log('✅ No schema drift detected.');
    }

    // Clean up the generated migration
    for (const file of newFiles) {
      fs.unlinkSync(`${MIGRATION_PATH}/${file}`);
    }
  } catch (err) {
    console.error('❌ Error checking migration drift:', err.message);
    process.exit(1);
  }
}

checkMigrationDrift();
