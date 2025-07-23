import { execSync } from 'child_process';
import * as fs from 'fs';

async function checkMigrationDrift() {
  const MIGRATION_PATH = 'libs/migration';
  
  // Ensure migration directory exists
  if (!fs.existsSync(MIGRATION_PATH)) {
    fs.mkdirSync(MIGRATION_PATH, { recursive: true });
  }
  
  const before = fs.readdirSync(MIGRATION_PATH);

  try {
    // Generate a migration to detect drift
    execSync(`npx typeorm migration:generate -f util/ormconfig.js -n DriftCheck --pretty`, {
      stdio: 'ignore',
    });

    const after = fs.readdirSync(MIGRATION_PATH);
    const newFiles = after.filter((f) => !before.includes(f));

    if (newFiles.length > 0) {
      console.log('📈 Schema drift detected. Migration needed.');
      console.log('MIGRATION_NEEDED=true');
      
      // Clean up the test migration - we'll generate a proper one later
      for (const file of newFiles) {
        console.log(`Detected changes that would generate: ${file}`);
        fs.unlinkSync(`${MIGRATION_PATH}/${file}`);
      }
    } else {
      console.log('✅ No schema drift detected.');
    }
  } catch (err: any) {
    console.error('❌ Error checking migration drift:', err.message);
    process.exit(1);
  }
}

checkMigrationDrift();