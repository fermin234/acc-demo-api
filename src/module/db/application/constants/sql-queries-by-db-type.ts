import * as dotenv from 'dotenv';

import { SqlQueries } from '../interfaces/sql-queries.interface';

dotenv.config();

export const sqlQueriesByDbType: Record<string, SqlQueries> = {
  postgres: {
    tableNameByDbType: 'table_name',
    show_tables: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`,
    get_table_schema: (tableName: string) => `
      SELECT COLUMN_NAME, DATA_TYPE as COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}' AND table_schema = 'public';`,
  },
  mysql: {
    tableNameByDbType: `Tables_in_${process.env.DB_NAME}`,
    show_tables: `SHOW TABLES;`,
    get_table_schema: (tableName: string) => `
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}';`,
  },
  'better-sqlite3': {
    tableNameByDbType: 'name',
    show_tables: `SELECT name FROM sqlite_master WHERE type='table';`,
    get_table_schema: (tableName) => `PRAGMA table_info(${tableName});`,
  },
};
