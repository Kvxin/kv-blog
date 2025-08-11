import { NestFactory } from '@nestjs/core';
import { KvBlogModule } from './kv-blog.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(KvBlogModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('BLOG_APP_PORT') ?? 7100);
  Logger.log(`KvBlog is running on port http://localhost:${configService.get('BLOG_APP_PORT') ?? 7100}`);
}
bootstrap();
