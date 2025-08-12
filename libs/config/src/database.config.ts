import { ConfigService } from './config.service';
import { DatabaseConfig } from './types/env.types';

export const getKvBlogDatabaseConfig = (configService: ConfigService): DatabaseConfig => ({
  type: 'mysql',
  name: 'kv-blog',
  host: configService.getString('KV_BLOG_DB_HOST', 'localhost'),
  port: configService.getNumber('KV_BLOG_DB_PORT', 3306),
  username: configService.getString('KV_BLOG_DB_USERNAME', 'root'),
  password: configService.getString('KV_BLOG_DB_PASSWORD', ''),
  database: configService.getString('KV_BLOG_DB_NAME', 'kv_blog'),
  synchronize: configService.getBoolean('KV_BLOG_DB_SYNC', false), 
  logging: configService.getBoolean('KV_BLOG_DB_LOGGING', false),
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
});

export const getKvAdminDatabaseConfig = (configService: ConfigService): DatabaseConfig => ({
  type: 'mysql',
  name: 'kv-admin',
  host: configService.getString('ADMIN_DATABASE_HOST', 'localhost'),
  port: configService.getString('ADMIN_DATABASE_PORT', '3306'),
  username: configService.getString('ADMIN_DATABASE_USER', 'root'),
  password: configService.getString('ADMIN_DATABASE_PASSWD', ''),
  database: configService.getString('ADMIN_DATABASE_TABLE', 'kv_admin'),
  synchronize: configService.getBoolean('ADMIN_DB_SYNC', false), 
  logging: configService.getBoolean('ADMIN_DB_LOGGING', false),
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
}); 