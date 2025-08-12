export interface DatabaseConfig {
  type: 'mysql';
  name: string;
  host: string;
  port: number|string;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  autoLoadEntities: boolean;
}

export interface AppConfig {
  port: number;
  environment: string;
}

export interface EnvironmentVariables {
  // 应用配置
  PORT: string;
  NODE_ENV: string;
  
  // kv-blog 数据库配置
  KV_BLOG_DB_HOST: string;
  KV_BLOG_DB_PORT: string;
  KV_BLOG_DB_USERNAME: string;
  KV_BLOG_DB_PASSWORD: string;
  KV_BLOG_DB_NAME: string;
  KV_BLOG_DB_SYNC: string;
  KV_BLOG_DB_LOGGING: string;
  
  // kv-admin 数据库配置
  ADMIN_DATABASE_HOST: string;
  ADMIN_DATABASE_PORT: string;
  ADMIN_DATABASE_USER: string;
  ADMIN_DATABASE_PASSWD: string;
  ADMIN_DATABASE_TABLE: string;
  ADMIN_DB_SYNC: string;
  ADMIN_DB_LOGGING: string;
} 