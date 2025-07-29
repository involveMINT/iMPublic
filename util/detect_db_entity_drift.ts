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
    execSync(`npx ts-node --project ./util/tsconfig.json ./node_modules/typeorm/cli.js migration:generate -n DriftCheck -f util/ormconfig.js`, {
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
      console.log('MIGRATION_NEEDED=false');
    }
  } catch (err: any) {
    // Check if this is the "no changes" case, which is actually success
    const errorOutput = err.stdout?.toString() || err.stderr?.toString() || err.message;
    if (errorOutput.includes('No changes in database schema were found')) {
      console.log('✅ No schema drift detected.');
      console.log('MIGRATION_NEEDED=false');
      return;
    }
    
    console.error('❌ Error checking migration drift:', err.message);
    if (err.stdout) console.error('stdout:', err.stdout.toString());
    if (err.stderr) console.error('stderr:', err.stderr.toString());
    
    // Try alternative syntax for TypeORM 0.2.x
    console.log('🔄 Trying alternative TypeORM syntax...');
    try {
      execSync(`npx ts-node --project ./util/tsconfig.json ./node_modules/typeorm/cli.js migration:generate -n DriftCheck -c default -f util/ormconfig.js`, {
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
        console.log('MIGRATION_NEEDED=false');
      }
    } catch (err2: any) {
      // Check if this is also the "no changes" case
      const errorOutput2 = err2.stdout?.toString() || err2.stderr?.toString() || err2.message;
      if (errorOutput2.includes('No changes in database schema were found')) {
        console.log('✅ No schema drift detected.');
        console.log('MIGRATION_NEEDED=false');
        return;
      }
      
      console.error('❌ Alternative syntax also failed:', err2.message);
      if (err2.stdout) console.error('stdout:', err2.stdout.toString());
      if (err2.stderr) console.error('stderr:', err2.stderr.toString());
      process.exit(1);
    }
  }
}

checkMigrationDrift();