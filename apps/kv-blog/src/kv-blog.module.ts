import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { KvBlogController } from './kv-blog.controller';
import { KvBlogService } from './kv-blog.service';
import { Post } from './entities/post.entity';
import { PostsModule } from './posts/posts.module';
import { ResponseInterceptor } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.prod', '.env'],
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
    TypeOrmModule.forFeature([Post], 'kv-blog'),
    PostsModule,
  ],
  controllers: [KvBlogController],
  providers: [
    KvBlogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class KvBlogModule { }
