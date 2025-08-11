import { Injectable } from '@nestjs/common';

@Injectable()
export class KvBlogService {
  getHello(): string {
    return 'Hello World!';
  }
}
