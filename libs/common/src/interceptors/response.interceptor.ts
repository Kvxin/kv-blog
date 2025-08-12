import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;
        
        // 如果返回的数据已经是标准格式，直接返回
        if (data && typeof data === 'object' && 'code' in data && 'message' in data && 'data' in data) {
          return data as ApiResponse<T>;
        }
        
        // 否则包装成标准格式
        return {
          code: statusCode,
          message: this.getSuccessMessage(statusCode),
          data: data || null,
        };
      }),
      catchError((error) => {
        // 处理错误情况
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse: ApiResponse<null> = {
          code: statusCode,
          message: error.message || this.getErrorMessage(statusCode),
          data: null,
        };
        
        // 设置HTTP状态码
        const response = context.switchToHttp().getResponse();
        response.status(statusCode);
        
        return throwError(() => errorResponse);
      }),
    );
  }

  private getSuccessMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.OK:
        return '操作成功';
      case HttpStatus.CREATED:
        return '创建成功';
      case HttpStatus.NO_CONTENT:
        return '删除成功';
      default:
        return '操作成功';
    }
  }

  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return '请求参数错误';
      case HttpStatus.UNAUTHORIZED:
        return '未授权访问';
      case HttpStatus.FORBIDDEN:
        return '禁止访问';
      case HttpStatus.NOT_FOUND:
        return '资源不存在';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return '服务器内部错误';
      default:
        return '操作失败';
    }
  }
}
