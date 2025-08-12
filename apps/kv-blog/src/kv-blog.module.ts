import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KvBlogController } from './kv-blog.controller';
import { KvBlogService } from './kv-blog.service';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      name: 'kv-blog',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        name: 'kv-blog',
        host: configService.get('KV_BLOG_DB_HOST', 'localhost'),
        port: configService.get('KV_BLOG_DB_PORT', 3306),
        username: configService.get('KV_BLOG_DB_USERNAME', 'root'),
        password: configService.get('KV_BLOG_DB_PASSWORD', ''),
        database: configService.get('KV_BLOG_DB_NAME', 'kv_blog'),
        synchronize: configService.get('KV_BLOG_DB_SYNC', false),
        logging: configService.get('KV_BLOG_DB_LOGGING', false),
        entities: [Post],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    // 为 Post 实体创建 TypeORM 特性模块
    TypeOrmModule.forFeature([Post], 'kv-blog'),
  ],
  controllers: [KvBlogController],
  providers: [KvBlogService],
})
export class KvBlogModule {}
