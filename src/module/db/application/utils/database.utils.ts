import { sqlQueriesByDbType } from '@/module/db/application/constants/sql-queries-by-db-type';
import { SqlQueries } from '@/module/db/application/interfaces/sql-queries.interface';

import AppDataSource from '../../../../config/orm.config';

export function getDatabaseType(): string {
  return AppDataSource.options.type || 'unknown';
}

export function getSqlQueriesByDbType(dbType: string): SqlQueries {
  const queries = sqlQueriesByDbType[dbType];

  if (!queries) {
    throw new Error(`Unsupported database type: ${dbType}`);
  }

  return queries;
}

export function formatColumnsForDb(dbType: string, columns: any[]): string {
  return columns
    .map((col) => {
      if (dbType === 'postgres') {
        const notNull = col.is_nullable === 'NO' ? ' NOT NULL' : '';
        const defaultValue = col.column_default
          ? `DEFAULT ${col.column_default}`
          : '';
        return `${col.column_name} (${col.column_type}${notNull} ${defaultValue})`.trim();
      }
      if (dbType === 'sqlite') {
        const columnType = col.type.toUpperCase();
        const isNotNull = col.notnull ? 'NOT NULL' : '';
        const defaultValue = col.dflt_value ? `DEFAULT ${col.dflt_value}` : '';
        const primaryKey = col.pk ? 'PRIMARY KEY' : '';
        return `${col.name} (${columnType} ${isNotNull} ${defaultValue} ${primaryKey})`.trim();
      }
      if (dbType === 'mysql') {
        const columnType = col.COLUMN_TYPE;
        const isNotNull = col.IS_NULLABLE === 'NO' ? 'NOT NULL' : '';
        const defaultValue = col.COLUMN_DEFAULT
          ? `DEFAULT ${col.COLUMN_DEFAULT}`
          : '';
        const extra = col.EXTRA ? col.EXTRA.toUpperCase() : '';

        return `${col.COLUMN_NAME} (${columnType} ${isNotNull} ${defaultValue} ${extra})`.trim();
      }

      return '';
    })
    .join(', ');
}

export function formatTableInfo(dbType: string, databaseInfo: any[]): string {
  return databaseInfo
    .map((table) => {
      const columns = formatColumnsForDb(dbType, table.columns);
      return `Table: ${table.tableName} with columns: ${columns}`;
    })
    .join('; ');
}
