import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KvAdminController } from './kv-admin.controller';
import { KvAdminService } from './kv-admin.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env','.env.prod'],
    }),
    TypeOrmModule.forRootAsync({
      name: 'kv_admin',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        name: 'kv_admin',
        host: configService.get('ADMIN_DATABASE_HOST', 'localhost'),
        port: configService.get('ADMIN_DATABASE_PORT', 3306),
        username: configService.get('ADMIN_DATABASE_USER', 'root'),
        password: configService.get('ADMIN_DATABASE_PASSWD', ''),
        database: configService.get('ADMIN_DATABASE_TABLE', 'kv_admin'),
        synchronize: configService.get('ADMIN_DB_SYNC', false),
        logging: configService.get('ADMIN_DB_LOGGING', false),
        entities: [User],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    // 为 User 实体创建 TypeORM 特性模块
    TypeOrmModule.forFeature([User], 'kv_admin'),
  ],
  controllers: [KvAdminController],
  providers: [KvAdminService],
})
export class KvAdminModule {}
