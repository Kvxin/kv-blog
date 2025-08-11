import { Test, TestingModule } from '@nestjs/testing';
import { KvAdminController } from './kv-admin.controller';
import { KvAdminService } from './kv-admin.service';

describe('KvAdminController', () => {
  let kvAdminController: KvAdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KvAdminController],
      providers: [KvAdminService],
    }).compile();

    kvAdminController = app.get<KvAdminController>(KvAdminController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(kvAdminController.getHello()).toBe('Hello World!');
    });
  });
});
