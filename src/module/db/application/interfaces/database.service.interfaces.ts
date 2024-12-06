export const DATABASE_SERVICE_KEY = 'DatabaseService';

export interface IDatabaseService {
  executeQuery(query: string, parameters: any[]): Promise<any>;
  allModels(): Promise<any>;
  getTableSchema(tableName: string): Promise<any>;
  databaseInfo(): Promise<any>;
}
