import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Post as PostEntity } from '../entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建新文章
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  /**
   * 获取所有文章（支持分页和搜索）
   */
  @Get()
  async findAll(@Query() queryPostsDto: QueryPostsDto): Promise<{
    posts: PostEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { posts, total } = await this.postsService.findAll(queryPostsDto);
    const { page = 1, limit = 10 } = queryPostsDto;
    
    return {
      posts,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  /**
   * 获取已发布的文章
   */
  @Get('published')
  async findPublished(@Query() queryPostsDto: QueryPostsDto): Promise<{
    posts: PostEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { posts, total } = await this.postsService.findPublished(queryPostsDto);
    const { page = 1, limit = 10 } = queryPostsDto;
    
    return {
      posts,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  /**
   * 根据ID获取文章
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(Number(id));
  }

  /**
   * 根据slug获取文章
   */
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postsService.findBySlug(slug);
  }

  /**
   * 更新文章
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(Number(id), updatePostDto);
  }

  /**
   * 删除文章
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(Number(id));
  }

  /**
   * 发布文章
   */
  @Patch(':id/publish')
  async publish(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.publish(Number(id));
  }

  /**
   * 取消发布文章
   */
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.unpublish(Number(id));
  }
} 