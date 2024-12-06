import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DatabaseService } from '@/module/db/application/service/database.service';
import {
  formatTableInfo,
  getDatabaseType,
} from '@/module/db/application/utils/database.utils';

@Controller('database')
@ApiTags('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async databaseInfo() {
    const dbType = getDatabaseType();
    const databaseInfo = await this.databaseService.databaseInfo();

    const databaseInfoParsed =
      process.env.NODE_ENV === 'automated_tests'
        ? formatTableInfo('sqlite', databaseInfo)
        : formatTableInfo(dbType, databaseInfo);

    return { databaseInfo: databaseInfoParsed };
  }
}
