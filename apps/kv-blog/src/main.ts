import { NestFactory } from '@nestjs/core';
import { KvBlogModule } from './kv-blog.module';

async function bootstrap() {
  const app = await NestFactory.create(KvBlogModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
