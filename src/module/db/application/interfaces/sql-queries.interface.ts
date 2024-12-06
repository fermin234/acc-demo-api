export interface SqlQueries {
  tableNameByDbType: string;
  show_tables: string;
  get_table_schema: (tableName: string) => string;
}
