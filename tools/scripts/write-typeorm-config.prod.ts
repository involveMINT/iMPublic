import { environmentPROD } from '@involvemint/shared/common';
import fs from 'fs';

fs.writeFileSync(
  'orm.config.json',
  JSON.stringify(
    {
      ...environmentPROD.typeOrmConfig,
      host: '35.224.125.164',
      migrations: [],
      entities: ['./**/*.entity{.ts,.js}'],
      cli: {
        migrationsDir: 'libs/shared/common/src/lib/migrations/prod',
      },
    },
    undefined,
    2
  )
);
