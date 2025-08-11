import { Controller, Get } from '@nestjs/common';
import { KvBlogService } from './kv-blog.service';

@Controller()
export class KvBlogController {
  constructor(private readonly kvBlogService: KvBlogService) {}

  @Get()
  getHello(): string {
    return this.kvBlogService.getHello();
  }
}
