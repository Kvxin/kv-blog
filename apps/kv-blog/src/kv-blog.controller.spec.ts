import { Test, TestingModule } from '@nestjs/testing';
import { KvBlogController } from './kv-blog.controller';
import { KvBlogService } from './kv-blog.service';

describe('KvBlogController', () => {
  let kvBlogController: KvBlogController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KvBlogController],
      providers: [KvBlogService],
    }).compile();

    kvBlogController = app.get<KvBlogController>(KvBlogController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(kvBlogController.getHello()).toBe('Hello World!');
    });
  });
});
