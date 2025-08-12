import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { DatabaseConfig, AppConfig, EnvironmentVariables } from './types/env.types';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService<EnvironmentVariables>) {}

  get database(): { kvBlog: DatabaseConfig; kvAdmin: DatabaseConfig } {
    return {
      kvBlog: {
        type: 'mysql',
        name: 'kv-blog',
        host: this.getString('KV_BLOG_DB_HOST', 'localhost'),
        port: this.getNumber('KV_BLOG_DB_PORT', 3306),
        username: this.getString('KV_BLOG_DB_USERNAME', 'root'),
        password: this.getString('KV_BLOG_DB_PASSWORD', ''),
        database: this.getString('KV_BLOG_DB_NAME', 'kv_blog'),
        synchronize: this.getBoolean('KV_BLOG_DB_SYNC', false),
        logging: this.getBoolean('KV_BLOG_DB_LOGGING', false),
        entities: ['dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      },
      kvAdmin: {
        type: 'mysql',
        name: 'kv-admin',
        host: this.getString('KV_ADMIN_DB_HOST', 'localhost'),
        port: this.getNumber('KV_ADMIN_DB_PORT', 3306),
        username: this.getString('KV_ADMIN_DB_USERNAME', 'root'),
        password: this.getString('KV_ADMIN_DB_PASSWORD', ''),
        database: this.getString('KV_ADMIN_DB_NAME', 'kv_admin'),
        synchronize: this.getBoolean('KV_ADMIN_DB_SYNC', false),
        logging: this.getBoolean('KV_ADMIN_DB_LOGGING', false),
        entities: ['dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      },
    };
  }

  get app(): AppConfig {
    return {
      port: this.getNumber('PORT', 3000),
      environment: this.getString('NODE_ENV', 'development'),
    };
  }

  // 便捷方法
  get<T = string>(key: keyof EnvironmentVariables, defaultValue?: T): T {
    if (defaultValue !== undefined) {
      return this.nestConfigService.get(key, defaultValue) as T;
    }
    return this.nestConfigService.get(key) as T;
  }

  getString(key: keyof EnvironmentVariables, defaultValue: string = ''): string {
    const value = this.nestConfigService.get(key);
    return value || defaultValue;
  }

  getNumber(key: keyof EnvironmentVariables, defaultValue: number = 0): number {
    const value = this.nestConfigService.get(key);
    return value ? parseInt(value, 10) : defaultValue;
  }

  getBoolean(key: keyof EnvironmentVariables, defaultValue: boolean = false): boolean {
    const value = this.nestConfigService.get(key);
    return value ? value === 'true' : defaultValue;
  }
}
