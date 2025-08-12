import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';

@Module({
  imports: [
    // kv-blog 数据库连接
    TypeOrmModule.forRootAsync({
      name: 'kv-blog',
      useFactory: (configService: ConfigService) => ({
        ...configService.database.kvBlog,
        name: 'kv-blog',
      }),
      inject: [ConfigService],
    }),
    // kv-admin 数据库连接
    TypeOrmModule.forRootAsync({
      name: 'kv-admin',
      useFactory: (configService: ConfigService) => ({
        ...configService.database.kvAdmin,
        name: 'kv-admin',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class DatabaseModule {} 