# KV Blog 后台管理系统 API 文档

## 📋 概述

本文档为KV Blog后台管理系统提供完整的API接口说明，涵盖用户管理、分类管理、标签管理、评论管理、系统设置等核心功能模块。

**基础信息：**
- 基础URL: `http://localhost:3000/api/v1`
- 认证方式: Bearer Token (JWT)
- 内容类型: `application/json`
- 权限说明: 个人博客系统，权限控制相对宽松

## 📦 统一响应格式

### 成功响应
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {}, // 实际数据
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/endpoint"
}
```

### 错误响应
```json
{
  "code": 400,
  "success": false,
  "message": "错误信息",
  "data": null,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/endpoint"
}
```

## 🔐 认证系统

### 1. 管理员登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "nickname": "管理员",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

### 2. 获取当前用户信息
```http
GET /auth/profile
Authorization: Bearer <token>
```

## 📊 仪表板统计

### 1. 获取仪表板统计数据
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "users": {
      "total": 89,
      "active": 85,
      "banned": 4,
      "newThisMonth": 12
    },
    "posts": {
      "total": 156,
      "published": 142,
      "draft": 12,
      "newThisMonth": 23
    },
    "comments": {
      "total": 234,
      "approved": 220,
      "pending": 12,
      "newThisMonth": 67
    },
    "categories": {
      "total": 12,
      "active": 10
    },
    "tags": {
      "total": 45,
      "active": 42
    },
    "system": {
      "version": "1.0.0",
      "uptime": 86400,
      "environment": "production"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/admin/dashboard/stats"
}
```

### 2. 获取最近活动
```http
GET /admin/dashboard/activities?limit=20
Authorization: Bearer <token>
```

### 3. 获取内容概览
```http
GET /admin/dashboard/content
Authorization: Bearer <token>
```

### 4. 获取系统健康状态
```http
GET /admin/system/health
Authorization: Bearer <token>
```

### 5. 获取数据分析
```http
GET /admin/analytics?days=30
Authorization: Bearer <token>
```

## 👥 用户管理

### 1. 获取用户列表
```http
GET /users?page=1&limit=20&keyword=john&role=user&status=active&sortBy=createdAt&sortOrder=DESC
Authorization: Bearer <token>
```

**查询参数：**
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10，最大：100）
- `keyword`: 搜索关键词（用户名、邮箱、昵称）
- `role`: 用户角色（`admin`|`user`）
- `status`: 用户状态（`active`|`inactive`|`banned`）
- `sortBy`: 排序字段（默认：`createdAt`）
- `sortOrder`: 排序方向（`ASC`|`DESC`，默认：`DESC`）

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "nickname": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "这是我的个人简介",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z",
        "lastLoginAt": "2024-01-16T09:15:00.000Z"
      }
    ],
    "total": 89,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users"
}
```

### 2. 创建用户（无需认证）
```http
POST /users
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "nickname": "新用户",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "用户简介",
  "role": "user",
  "status": "active"
}
```

**字段说明：**
- `username`: 用户名（必填，3-50字符）
- `email`: 邮箱地址（必填，有效邮箱格式）
- `password`: 密码（必填，最少6位）
- `nickname`: 昵称（可选，最多50字符）
- `avatar`: 头像URL（可选）
- `bio`: 个人简介（可选）
- `role`: 用户角色（可选，`admin`|`user`，默认：`user`）
- `status`: 用户状态（可选，`active`|`inactive`|`banned`，默认：`active`）

### 3. 获取用户详情
```http
GET /users/:id
Authorization: Bearer <token>
```

### 4. 更新用户信息
```http
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "更新后的昵称",
  "avatar": "https://example.com/new-avatar.jpg",
  "bio": "更新后的简介",
  "role": "admin",
  "status": "active"
}
```

### 5. 修改用户密码
```http
PATCH /users/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 6. 删除用户
```http
DELETE /users/:id
Authorization: Bearer <token>
```

### 7. 封禁用户
```http
PATCH /users/:id/ban
Authorization: Bearer <token>
```

### 8. 解封用户
```http
PATCH /users/:id/unban
Authorization: Bearer <token>
```

### 9. 获取用户统计信息
```http
GET /users/stats
Authorization: Bearer <token>
```

### 10. 根据用户名获取用户信息
```http
GET /users/username/:username
Authorization: Bearer <token>
```

## 📂 分类管理

### 1. 获取分类列表
```http
GET /categories?page=1&limit=20&keyword=技术&isActive=true&sortBy=sort&sortOrder=ASC
```

**查询参数：**
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `keyword`: 搜索关键词
- `isActive`: 是否启用（`true`|`false`）
- `sortBy`: 排序字段（默认：`sort`）
- `sortOrder`: 排序方向（默认：`ASC`）

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "技术分享",
        "slug": "tech-sharing",
        "description": "分享技术相关的文章和经验",
        "color": "#3498db",
        "sort": 0,
        "isActive": true,
        "postCount": 25,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/categories"
}
```

### 2. 创建分类
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新分类",
  "slug": "new-category",
  "description": "分类描述",
  "color": "#3498db",
  "sort": 0,
  "isActive": true
}
```

**字段说明：**
- `name`: 分类名称（必填，最多50字符）
- `slug`: 分类别名（必填，URL友好，最多100字符）
- `description`: 分类描述（可选）
- `color`: 分类颜色（可选，十六进制颜色值）
- `sort`: 排序权重（可选，数字，默认：0）
- `isActive`: 是否启用（可选，布尔值，默认：true）

### 3. 获取分类详情
```http
GET /categories/:id
```

### 4. 根据别名获取分类详情
```http
GET /categories/slug/:slug
```

### 5. 更新分类
```http
PATCH /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的分类名",
  "description": "更新后的描述",
  "color": "#e74c3c",
  "sort": 1,
  "isActive": false
}
```

### 6. 删除分类
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### 7. 获取启用的分类列表
```http
GET /categories/active
```

## 🏷️ 标签管理

### 1. 获取标签列表
```http
GET /tags?page=1&limit=20&keyword=JavaScript&isActive=true&sortBy=name&sortOrder=ASC
```

**查询参数：**
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `keyword`: 搜索关键词
- `isActive`: 是否启用（`true`|`false`）
- `sortBy`: 排序字段（默认：`name`）
- `sortOrder`: 排序方向（默认：`ASC`）

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "JavaScript",
        "slug": "javascript",
        "description": "JavaScript编程语言相关内容",
        "color": "#f39c12",
        "isActive": true,
        "postCount": 15,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/tags"
}
```

### 2. 创建标签
```http
POST /tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新标签",
  "slug": "new-tag",
  "description": "标签描述",
  "color": "#e74c3c",
  "isActive": true
}
```

**字段说明：**
- `name`: 标签名称（必填，最多50字符）
- `slug`: 标签别名（必填，URL友好，最多100字符）
- `description`: 标签描述（可选）
- `color`: 标签颜色（可选，十六进制颜色值）
- `isActive`: 是否启用（可选，布尔值，默认：true）

### 3. 获取标签详情
```http
GET /tags/:id
```

### 4. 根据别名获取标签详情
```http
GET /tags/slug/:slug
```

### 5. 更新标签
```http
PATCH /tags/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的标签名",
  "description": "更新后的描述",
  "color": "#9b59b6",
  "isActive": false
}
```

### 6. 删除标签
```http
DELETE /tags/:id
Authorization: Bearer <token>
```

### 7. 获取启用的标签列表
```http
GET /tags/active
```

### 8. 获取热门标签
```http
GET /tags/popular?limit=10
```

## 💬 评论管理

### 1. 获取评论列表
```http
GET /comments?page=1&limit=20&postId=1&status=pending&authorId=2&parentId=1&sortBy=createdAt&sortOrder=DESC
```

**查询参数：**
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `postId`: 文章ID
- `status`: 评论状态（`pending`|`approved`|`rejected`）
- `authorId`: 作者ID
- `parentId`: 父评论ID（获取回复时使用）
- `sortBy`: 排序字段（默认：`createdAt`）
- `sortOrder`: 排序方向（默认：`DESC`）

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "content": "这篇文章写得很好！",
        "status": "approved",
        "likeCount": 5,
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "author": {
          "id": 2,
          "username": "commenter",
          "nickname": "评论者",
          "avatar": "https://example.com/avatar.jpg"
        },
        "post": {
          "id": 1,
          "title": "文章标题",
          "slug": "article-slug"
        },
        "parentId": null,
        "replyCount": 3,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "total": 234,
    "page": 1,
    "limit": 20,
    "totalPages": 12
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/comments"
}
```

### 2. 管理员获取评论列表
```http
GET /admin/comments?page=1&limit=20&status=pending&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### 3. 获取文章的评论
```http
GET /comments/post/:postId?includeReplies=true
```

### 4. 创建评论
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "这篇文章写得很好！",
  "postId": 1,
  "parentId": null
}
```

**字段说明：**
- `content`: 评论内容（必填）
- `postId`: 文章ID（必填，数字）
- `parentId`: 父评论ID（可选，回复评论时使用）

### 5. 更新评论
```http
PATCH /comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "这篇文章写得很好！（已修改）",
  "status": "approved"
}
```

### 6. 删除评论
```http
DELETE /comments/:id
Authorization: Bearer <token>
```

### 7. 审核通过评论
```http
PATCH /comments/:id/approve
Authorization: Bearer <token>
```

### 8. 拒绝评论
```http
PATCH /comments/:id/reject
Authorization: Bearer <token>
```

### 9. 批量审核评论
```http
POST /admin/comments/batch-approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approve",
  "commentIds": [1, 2, 3, 4],
  "reason": "批量审核通过"
}
```

**字段说明：**
- `action`: 操作类型（`approve`|`reject`|`delete`）
- `commentIds`: 评论ID数组
- `reason`: 操作理由（可选）

## ⚙️ 系统设置

### 1. 获取系统配置
```http
GET /admin/system/config
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "success": true,
  "message": "Success",
  "data": {
    "siteTitle": "KV Blog",
    "siteDescription": "一个基于NestJS的个人博客系统",
    "siteKeywords": "博客,技术,分享",
    "allowRegistration": true,
    "requireCommentApproval": true,
    "postsPerPage": 10,
    "maxFileSize": 5242880
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/admin/system/config"
}
```

### 2. 更新系统配置
```http
PATCH /admin/system/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "siteTitle": "我的博客",
  "siteDescription": "这是一个技术博客",
  "siteKeywords": "技术,编程,分享",
  "allowRegistration": false,
  "requireCommentApproval": true,
  "postsPerPage": 15,
  "maxFileSize": 10485760
}
```

**字段说明：**
- `siteTitle`: 网站标题（可选）
- `siteDescription`: 网站描述（可选）
- `siteKeywords`: 网站关键词（可选）
- `allowRegistration`: 是否允许用户注册（可选，布尔值）
- `requireCommentApproval`: 是否需要评论审核（可选，布尔值）
- `postsPerPage`: 每页显示文章数量（可选，1-100）
- `maxFileSize`: 文件上传大小限制（可选，1-100MB）

### 3. 系统备份
```http
POST /admin/system/backup
Authorization: Bearer <token>
```

### 4. 获取系统日志
```http
GET /admin/system/logs
Authorization: Bearer <token>
```

### 5. 清理系统缓存
```http
DELETE /admin/system/cache
Authorization: Bearer <token>
```

### 6. 重建搜索索引
```http
POST /admin/system/reindex
Authorization: Bearer <token>
```

## 📁 文件管理

### 1. 上传图片
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: 图片文件
```

**响应示例：**
```json
{
  "code": 201,
  "success": true,
  "message": "Success",
  "data": {
    "filename": "image_20240115_103045.jpg",
    "originalName": "my-image.jpg",
    "url": "http://localhost:3000/uploads/images/image_20240115_103045.jpg",
    "size": 245760,
    "mimeType": "image/jpeg"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/upload/image"
}
```

### 2. 上传多个图片
```http
POST /upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- files: 多个图片文件
```

### 3. 删除文件
```http
DELETE /upload/file/:filename
Authorization: Bearer <token>
```

### 4. 获取文件列表
```http
GET /admin/files?type=image&page=1&limit=20
Authorization: Bearer <token>
```

## 📊 数据统计与分析

### 1. 获取访问统计
```http
GET /admin/analytics/visits?period=month&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### 2. 获取内容统计
```http
GET /admin/analytics/content
Authorization: Bearer <token>
```

### 3. 获取用户活跃度统计
```http
GET /admin/analytics/users?period=week
Authorization: Bearer <token>
```

### 4. 获取热门内容
```http
GET /admin/analytics/popular?type=posts&limit=10
Authorization: Bearer <token>
```

## 🔍 搜索功能

### 1. 全站搜索
```http
GET /search?q=关键词&type=all&page=1&limit=20
Authorization: Bearer <token>
```

**查询参数：**
- `q`: 搜索关键词（必填）
- `type`: 搜索类型（`all`|`posts`|`users`|`comments`）
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）

### 2. 获取搜索建议
```http
GET /search/suggestions?q=关键词&limit=10
Authorization: Bearer <token>
```

## 📋 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复创建） |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 🔒 权限说明

### 角色权限
- **admin**: 管理员，拥有所有权限
- **user**: 普通用户，可以发表文章和评论

### 接口权限
- **无需认证**: 创建用户、获取公开内容
- **需要登录**: 大部分管理功能
- **仅管理员**: 系统设置、用户管理、评论审核等

## 📝 使用示例

### 完整的后台管理流程

1. **创建管理员用户**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "nickname": "博客管理员",
    "role": "admin"
  }'
```

2. **登录获取Token**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

3. **获取仪表板数据**
```bash
curl -X GET http://localhost:3000/api/v1/admin/dashboard/stats \
  -H "Authorization: Bearer <your-token>"
```

4. **创建分类**
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "技术分享",
    "slug": "tech-sharing",
    "description": "技术相关文章分类",
    "color": "#3498db"
  }'
```

5. **创建标签**
```bash
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "JavaScript",
    "slug": "javascript",
    "description": "JavaScript相关内容",
    "color": "#f39c12"
  }'
```

6. **审核评论**
```bash
curl -X PATCH http://localhost:3000/api/v1/comments/1/approve \
  -H "Authorization: Bearer <your-token>"
```

**注意事项：**
1. **个人博客系统**：权限控制相对宽松，适合个人使用
2. **用户创建**：无需认证即可创建用户，方便快速添加管理员和作者
3. **角色设置**：创建用户时可直接设置 `role` 为 `admin` 或 `user`
4. 所有时间格式均为 ISO 8601 标准格式
5. 分页参数：page 从 1 开始，limit 最大值为 100
6. 文件上传大小限制：图片 5MB，文档 10MB
7. Token 有效期为 7 天，过期后需要重新登录
8. 所有删除操作都是软删除，可以恢复

这个API文档涵盖了后台管理系统的所有核心功能，可以直接用于前端开发！
