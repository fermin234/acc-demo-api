import { DatabaseModule } from '@/module/db/database.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  StorageDriver,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import { setupApp, setupSentry, setupSwagger } from '@config/app.config';

import { registerDatabaseOnAdminJS } from '@/module/adminjs/config/admin.config';
import { AppModule } from '@/module/app/app.module';

import './config/instrument';

async function bootstrap() {
  await DatabaseModule.initialize();
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  await registerDatabaseOnAdminJS();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(configService.get('frontend.url'));
  setupSentry(app);
  setupApp(app);
  setupSwagger(app);
  await app.listen(configService.get('server.port'));
}

bootstrap();
