import { Module } from '@nestjs/common';
import { KvAdminController } from './kv-admin.controller';
import { KvAdminService } from './kv-admin.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [KvAdminController],
  providers: [KvAdminService],
})
export class KvAdminModule { }
