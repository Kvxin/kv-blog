import { NestFactory } from '@nestjs/core';
import { KvAdminModule } from './kv-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(KvAdminModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
