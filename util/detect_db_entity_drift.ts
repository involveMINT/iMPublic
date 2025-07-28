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
    console.log('🔍 Checking for schema drift...');
    execSync(`npx typeorm migration:generate -n DriftCheck -f util/ormconfig.js`, {
      stdio: 'pipe',
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
    if (err.stdout) console.error('stdout:', err.stdout.toString());
    if (err.stderr) console.error('stderr:', err.stderr.toString());
    
    // Try alternative syntax for TypeORM 0.2.x
    console.log('🔄 Trying alternative TypeORM syntax...');
    try {
      execSync(`npx typeorm migration:generate -n DriftCheck -c default -f util/ormconfig.js`, {
        stdio: 'pipe',
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
    } catch (err2: any) {
      console.error('❌ Alternative syntax also failed:', err2.message);
      if (err2.stdout) console.error('stdout:', err2.stdout.toString());
      if (err2.stderr) console.error('stderr:', err2.stderr.toString());
      process.exit(1);
    }
  }
}

checkMigrationDrift();