import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post, 'kv-blog')
    private readonly postRepository: Repository<Post>,
  ) { }

  /**
   * 创建新文章
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    // 检查slug是否已存在
    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostDto.slug },
    });

    if (existingPost) {
      throw new BadRequestException('文章别名已存在');
    }

    const post = this.postRepository.create(createPostDto);

    // 如果设置为发布状态，设置发布时间
    if (createPostDto.isPublished) {
      post.publishedAt = new Date();
    }

    return await this.postRepository.save(post);
  }

  /**
   * 获取所有文章（支持分页和搜索）
   */
  async findAll(queryPostsDto: QueryPostsDto): Promise<{ posts: Post[]; total: number }> {
    const { page = 1, limit = 10, search, isPublished, author } = queryPostsDto;

    const options: FindManyOptions<Post> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {},
    };

    // 添加搜索条件
    if (search) {
      options.where = [
        { title: Like(`%${search}%`) },
        { content: Like(`%${search}%`) },
        { excerpt: Like(`%${search}%`) },
      ];
    }

    // 添加发布状态过滤
    if (isPublished !== undefined) {
      if (options.where instanceof Array) {
        options.where = options.where.map(condition => ({
          ...condition,
          isPublished,
        }));
      } else {
        options.where = { ...options.where, isPublished };
      }
    }

    // 添加作者过滤
    if (author) {
      if (options.where instanceof Array) {
        options.where = options.where.map(condition => ({
          ...condition,
          author,
        }));
      } else {
        options.where = { ...options.where, author };
      }
    }

    const [posts, total] = await this.postRepository.findAndCount(options);

    return { posts, total };
  }

    /**
   * 根据ID获取文章
   */
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    
    return post;
  }

  /**
   * 根据slug获取文章
   */
  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { slug } });

    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    return post;
  }

    /**
   * 更新文章
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    // 如果更新slug，检查是否与其他文章冲突
    if (updatePostDto.slug && updatePostDto.slug !== post.slug) {
      const existingPost = await this.postRepository.findOne({
        where: { slug: updatePostDto.slug },
      });
      
      if (existingPost) {
        throw new BadRequestException('文章别名已存在');
      }
    }

    // 如果从未发布变为发布，设置发布时间
    if (!post.isPublished && updatePostDto.isPublished) {
      post.publishedAt = new Date();
    }

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  /**
   * 删除文章
   */
  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }

  /**
   * 发布文章
   */
  async publish(id: number): Promise<Post> {
    const post = await this.findOne(id);
    post.isPublished = true;
    post.publishedAt = new Date();
    return await this.postRepository.save(post);
  }

  /**
   * 取消发布文章
   */
  async unpublish(id: number): Promise<Post> {
    const post = await this.findOne(id);
    post.isPublished = false;
    post.publishedAt = undefined;
    return await this.postRepository.save(post);
  }

  /**
   * 获取已发布的文章
   */
  async findPublished(queryPostsDto: QueryPostsDto): Promise<{ posts: Post[]; total: number }> {
    return this.findAll({ ...queryPostsDto, isPublished: true });
  }
} 