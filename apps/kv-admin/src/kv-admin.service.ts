import { Injectable } from '@nestjs/common';

@Injectable()
export class KvAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
