import * as cp from 'child_process';
import * as fs from 'fs';

// this exceptionally hacky...but it seems to works

const prodMigrations = './libs/shared/common/src/lib/migrations/prod';
cp.execSync(`rm -rf ${prodMigrations}/*`, { stdio: 'inherit' });

const id = 'dbmigration';
cp.execSync(`npm run typeorm:migration:generate:prod -- ${id}`, { stdio: 'inherit' });

fs.readdir(prodMigrations, (err, files) => {
  if (err) throw new Error('Unable to scan directory: ' + err);
  if (files.length > 1) throw new Error('More than one migration files found!');
  if (files.length < 1) {
    throw new Error('No migration files found! It might be that there are no necessary migrations');
  }

  const migrationFileName = files[0];

  const prodEnvFilePath = `./libs/shared/common/src/lib/environments/environment.prod.ts`;
  const prodEnvFile = fs.readFileSync(prodEnvFilePath);
  const newEnvFile = fs.openSync(prodEnvFilePath, 'w+');

  const noTs = migrationFileName.replace('.ts', '');
  const reverse = `${noTs.split('-')[1]}${noTs.split('-')[0]}`;

  const importLine = Buffer.from(`import { ${reverse} } from '../migrations/prod/${noTs}';\n`);
  const migrations = Buffer.from(`  migrations: [${reverse}]\n  },\n};\n`);
  fs.writeSync(newEnvFile, importLine, 0, importLine.length, 0);
  fs.writeSync(newEnvFile, prodEnvFile, 0, prodEnvFile.length, importLine.length);
  fs.writeSync(newEnvFile, migrations, 0, migrations.length, prodEnvFile.length + importLine.length - 8);
  fs.close(newEnvFile, (err) => {
    if (err) throw err;
  });
});
