import { NestFactory } from '@nestjs/core';
import { KvAdminModule } from './kv-admin.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(KvAdminModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('ADMIN_APP_PORT') ?? 7000);
  Logger.log(`KvAdmin is running on port http://localhost:${configService.get('ADMIN_APP_PORT') ?? 7000}`);
}
bootstrap();
