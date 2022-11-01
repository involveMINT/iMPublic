import { environment } from '@involvemint/shared/common';
import fs from 'fs';

fs.writeFileSync(
  'orm.config.json',
  JSON.stringify(
    {
      ...environment.typeOrmConfig,
      host: 'localhost',
      migrations: [],
      entities: ['./**/*.entity{.ts,.js}'],
      cli: {
        migrationsDir: 'libs/shared/common/src/lib/migrations/dev',
      },
    },
    undefined,
    2
  )
);
