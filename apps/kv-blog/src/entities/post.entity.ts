import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@app/common/entities/base.entity';

@Entity('posts')
@Index(['slug'], { unique: true })
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  excerpt: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;
} 