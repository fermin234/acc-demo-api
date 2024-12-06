import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from '@/module/db/application/service/database.service';
import { DatabaseController } from '@/module/db/interface/database.controller';

import AppDataSource from '../../config/orm.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  static async initialize(): Promise<void> {
    await AppDataSource.initialize();
  }
}
