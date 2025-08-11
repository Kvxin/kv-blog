import { Module } from '@nestjs/common';
import { KvAdminController } from './kv-admin.controller';
import { KvAdminService } from './kv-admin.service';

@Module({
  imports: [],
  controllers: [KvAdminController],
  providers: [KvAdminService],
})
export class KvAdminModule {}
