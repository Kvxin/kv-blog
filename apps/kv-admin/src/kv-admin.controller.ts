import { Controller, Get } from '@nestjs/common';
import { KvAdminService } from './kv-admin.service';

@Controller()
export class KvAdminController {
  constructor(private readonly kvAdminService: KvAdminService) {}

  @Get()
  getHello(): string {
    return this.kvAdminService.getHello();
  }
}
