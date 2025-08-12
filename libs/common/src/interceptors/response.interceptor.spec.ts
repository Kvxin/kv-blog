import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockResponse = {
      statusCode: HttpStatus.OK,
      status: jest.fn(),
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('successful responses', () => {
    it('should wrap simple data in standard format', (done) => {
      const testData = { id: 1, name: 'test' };
      mockCallHandler.handle = jest.fn(() => of(testData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            code: 200,
            message: '操作成功',
            data: testData,
          });
          done();
        },
      });
    });

    it('should handle null data', (done) => {
      mockCallHandler.handle = jest.fn(() => of(null));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            code: 200,
            message: '操作成功',
            data: null,
          });
          done();
        },
      });
    });

    it('should handle undefined data', (done) => {
      mockCallHandler.handle = jest.fn(() => of(undefined));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            code: 200,
            message: '操作成功',
            data: null,
          });
          done();
        },
      });
    });

    it('should not wrap data that is already in standard format', (done) => {
      const standardData = {
        code: 201,
        message: '自定义消息',
        data: { id: 1 },
      };
      mockCallHandler.handle = jest.fn(() => of(standardData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual(standardData);
          done();
        },
      });
    });

    it('should handle CREATED status code', (done) => {
      mockResponse.statusCode = HttpStatus.CREATED;
      const testData = { id: 1, name: 'new item' };
      mockCallHandler.handle = jest.fn(() => of(testData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            code: 201,
            message: '创建成功',
            data: testData,
          });
          done();
        },
      });
    });

    it('should handle NO_CONTENT status code', (done) => {
      mockResponse.statusCode = HttpStatus.NO_CONTENT;
      mockCallHandler.handle = jest.fn(() => of(null));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            code: 204,
            message: '删除成功',
            data: null,
          });
          done();
        },
      });
    });
  });

  describe('error responses', () => {
    it('should handle errors with status and message', (done) => {
      const error = {
        status: HttpStatus.NOT_FOUND,
        message: '用户不存在',
      };
      mockCallHandler.handle = jest.fn(() => throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (result) => {
          expect(result).toEqual({
            code: 404,
            message: '用户不存在',
            data: null,
          });
          expect(mockResponse.status).toHaveBeenCalledWith(404);
          done();
        },
      });
    });

    it('should handle errors without status', (done) => {
      const error = {
        message: '自定义错误',
      };
      mockCallHandler.handle = jest.fn(() => throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (result) => {
          expect(result).toEqual({
            code: 500,
            message: '自定义错误',
            data: null,
          });
          expect(mockResponse.status).toHaveBeenCalledWith(500);
          done();
        },
      });
    });

    it('should handle errors without message', (done) => {
      const error = {
        status: HttpStatus.BAD_REQUEST,
      };
      mockCallHandler.handle = jest.fn(() => throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (result) => {
          expect(result).toEqual({
            code: 400,
            message: '请求参数错误',
            data: null,
          });
          expect(mockResponse.status).toHaveBeenCalledWith(400);
          done();
        },
      });
    });
  });
});
