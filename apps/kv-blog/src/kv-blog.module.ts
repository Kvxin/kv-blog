import { Module } from '@nestjs/common';
import { KvBlogController } from './kv-blog.controller';
import { KvBlogService } from './kv-blog.service';

@Module({
  imports: [],
  controllers: [KvBlogController],
  providers: [KvBlogService],
})
export class KvBlogModule {}
