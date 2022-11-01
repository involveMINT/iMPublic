import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class DatabaseService {
  async clearDb() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      try {
        await repository.query(`TRUNCATE "${entity.tableName}" CASCADE`);
        // eslint-disable-next-line no-empty
      } catch {} // ignore trying to delete views
    }
  }
}
