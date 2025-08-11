import { Module } from '@nestjs/common';
import { KvBlogController } from './kv-blog.controller';
import { KvBlogService } from './kv-blog.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        '.env.prod',
      ],
    }),
  ],
  controllers: [KvBlogController],
  providers: [KvBlogService],
})
export class KvBlogModule { }
