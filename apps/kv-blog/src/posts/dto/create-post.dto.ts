import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: '文章标题',
    example: '我的第一篇博客文章',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: '文章别名（URL友好的标识符）',
    example: 'my-first-blog-post',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  slug: string;

  @ApiProperty({
    description: '文章内容',
    example: '这是文章的主要内容...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: '文章摘要',
    example: '这是文章的简短摘要...',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({
    description: '作者名称',
    example: '张三',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @ApiPropertyOptional({
    description: '是否发布',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: '特色图片URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: '文章标签（逗号分隔）',
    example: '技术,编程,NestJS',
  })
  @IsOptional()
  @IsString()
  tags?: string;
} 