import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KvBlogService } from './kv-blog.service';
import { Post as PostEntity } from './entities/post.entity';

@Controller('kv-blog')
export class KvBlogController {
  constructor(private readonly kvBlogService: KvBlogService) {}

  @Post()
  create(@Body() createPostDto: Partial<PostEntity>) {
    return this.kvBlogService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.kvBlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kvBlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: Partial<PostEntity>) {
    return this.kvBlogService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kvBlogService.remove(+id);
  }
}
