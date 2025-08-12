# Response Interceptor 使用说明

## 概述

`ResponseInterceptor` 是一个全局响应拦截器，用于统一 kv-admin 和 kv-blog 应用的 API 响应格式。

## 响应格式

所有 API 响应都会被统一包装成以下格式：

```typescript
{
  code: number,      // HTTP状态码
  message: string,   // 响应消息
  data: any | null   // 响应数据，可以是任何类型或null
}
```

## 配置

拦截器已经在以下模块中配置为全局拦截器：

- `apps/kv-admin/src/kv-admin.module.ts`
- `apps/kv-blog/src/kv-blog.module.ts`

## 使用示例

### 1. 成功响应

**控制器代码：**
```typescript
@Get()
async findAll() {
  const users = await this.userService.findAll();
  return users; // 直接返回数据
}
```

**实际响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    { "id": 1, "name": "用户1" },
    { "id": 2, "name": "用户2" }
  ]
}
```

### 2. 创建成功响应

**控制器代码：**
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async create(@Body() createUserDto: CreateUserDto) {
  const user = await this.userService.create(createUserDto);
  return user;
}
```

**实际响应：**
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 3,
    "name": "新用户"
  }
}
```

### 3. 删除成功响应

**控制器代码：**
```typescript
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id') id: string) {
  await this.userService.remove(+id);
  return; // 或者 return null
}
```

**实际响应：**
```json
{
  "code": 204,
  "message": "删除成功",
  "data": null
}
```

### 4. 错误响应

当控制器抛出异常时，拦截器会自动处理：

**控制器代码：**
```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.userService.findOne(+id);
  if (!user) {
    throw new NotFoundException('用户不存在');
  }
  return user;
}
```

**实际响应（404错误）：**
```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

### 5. 自定义响应格式

如果你需要返回自定义的响应格式，可以直接返回符合 `ApiResponse` 接口的对象：

**控制器代码：**
```typescript
@Get('custom')
async customResponse() {
  return {
    code: 200,
    message: "自定义成功消息",
    data: { custom: "data" }
  };
}
```

**实际响应：**
```json
{
  "code": 200,
  "message": "自定义成功消息",
  "data": {
    "custom": "data"
  }
}
```

## 错误消息映射

拦截器会根据 HTTP 状态码自动映射错误消息：

- `400` - 请求参数错误
- `401` - 未授权访问
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器内部错误

## 成功消息映射

拦截器会根据 HTTP 状态码自动映射成功消息：

- `200` - 操作成功
- `201` - 创建成功
- `204` - 删除成功

## 注意事项

1. 拦截器会自动处理所有控制器的响应，无需手动包装
2. 如果返回的数据已经是标准格式（包含 code、message、data 字段），拦截器不会重复包装
3. 错误处理会自动设置正确的 HTTP 状态码
4. 拦截器是全局的，会影响所有路由的响应格式
