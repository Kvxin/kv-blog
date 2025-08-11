# KV Blog 后台管理系统 API 文档

## 📋 概述

本文档专门为KV Blog后台管理系统提供API接口说明，包含管理员权限的所有功能接口。

**基础信息：**

- 基础URL: `http://localhost:3000/api/v1`
- 认证方式: Bearer Token (JWT)
- 内容类型: `application/json`
- 管理员权限: 所有管理接口都需要管理员权限

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
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "nickname": "管理员",
    "role": "admin",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
  "totalPosts": 156,
  "totalUsers": 89,
  "totalComments": 234,
  "totalCategories": 12,
  "totalTags": 45,
  "recentStats": {
    "postsThisMonth": 23,
    "usersThisMonth": 12,
    "commentsThisMonth": 67
  },
  "popularPosts": [
    {
      "id": 1,
      "title": "热门文章标题",
      "viewCount": 1250,
      "likeCount": 89
    }
  ]
}
```

### 2. 获取系统活动日志

```http
GET /admin/dashboard/activities
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- type: 活动类型 (可选)
- startDate: 开始日期 (可选)
- endDate: 结束日期 (可选)
```

## 📝 文章管理

### 1. 获取文章列表（管理员视图）

```http
GET /admin/posts
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- status: 文章状态 (draft|published|archived)
- categoryId: 分类ID
- authorId: 作者ID
- keyword: 搜索关键词
- sortBy: 排序字段 (createdAt|updatedAt|viewCount)
- sortOrder: 排序方向 (ASC|DESC)
```

**响应示例：**

```json
{
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "excerpt": "文章摘要",
      "status": "published",
      "viewCount": 150,
      "likeCount": 25,
      "commentCount": 8,
      "author": {
        "id": 1,
        "username": "author",
        "nickname": "作者昵称"
      },
      "category": {
        "id": 1,
        "name": "技术分享"
      },
      "tags": [
        { "id": 1, "name": "JavaScript" },
        { "id": 2, "name": "Node.js" }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### 2. 创建文章

```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新文章标题",
  "content": "文章内容...",
  "excerpt": "文章摘要",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": "published",
  "featuredImage": "https://example.com/image.jpg",
  "isTop": false,
  "allowComments": true
}
```

### 3. 更新文章

```http
PATCH /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容...",
  "status": "published"
}
```

### 4. 删除文章

```http
DELETE /posts/:id
Authorization: Bearer <token>
```

### 5. 批量操作文章

```http
POST /admin/posts/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "delete|publish|archive",
  "postIds": [1, 2, 3, 4]
}
```

## 👥 用户管理

### 1. 获取用户列表（管理员视图）

```http
GET /admin/users
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- role: 用户角色 (admin|user)
- status: 用户状态 (active|inactive|banned)
- keyword: 搜索关键词
- sortBy: 排序字段 (createdAt|lastLoginAt)
- sortOrder: 排序方向 (ASC|DESC)
```

### 2. 创建用户

```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "nickname": "新用户",
  "role": "user",
  "status": "active"
}
```

### 3. 更新用户信息

```http
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "更新后的昵称",
  "role": "admin",
  "status": "active"
}
```

### 4. 删除用户

```http
DELETE /users/:id
Authorization: Bearer <token>
```

### 5. 重置用户密码

```http
POST /admin/users/:id/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

## 📂 分类管理

### 1. 获取分类列表

```http
GET /categories
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- keyword: 搜索关键词
- isEnabled: 是否启用 (true|false)
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
  "sortOrder": 1,
  "isEnabled": true
}
```

### 3. 更新分类

```http
PATCH /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的分类名",
  "description": "更新后的描述"
}
```

### 4. 删除分类

```http
DELETE /categories/:id
Authorization: Bearer <token>
```

## 🏷️ 标签管理

### 1. 获取标签列表

```http
GET /tags
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- keyword: 搜索关键词
- isEnabled: 是否启用 (true|false)
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
  "isEnabled": true
}
```

### 3. 更新标签

```http
PATCH /tags/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的标签名",
  "color": "#f39c12"
}
```

### 4. 删除标签

```http
DELETE /tags/:id
Authorization: Bearer <token>
```

### 5. 获取热门标签

```http
GET /tags/popular
Authorization: Bearer <token>

Query Parameters:
- limit: 返回数量 (默认: 10)
```

## 💬 评论管理

### 1. 获取评论列表（管理员视图）

```http
GET /admin/comments
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- status: 评论状态 (pending|approved|rejected)
- postId: 文章ID
- authorId: 评论者ID
- keyword: 搜索关键词
- sortBy: 排序字段 (createdAt|updatedAt)
- sortOrder: 排序方向 (ASC|DESC)
```

**响应示例：**

```json
{
  "data": [
    {
      "id": 1,
      "content": "评论内容",
      "status": "approved",
      "author": {
        "id": 2,
        "username": "commenter",
        "nickname": "评论者"
      },
      "post": {
        "id": 1,
        "title": "文章标题"
      },
      "parentId": null,
      "replyCount": 3,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 234,
  "page": 1,
  "limit": 20
}
```

### 2. 审核评论

```http
PATCH /comments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved|rejected",
  "reason": "审核理由（拒绝时必填）"
}
```

### 3. 删除评论

```http
DELETE /comments/:id
Authorization: Bearer <token>
```

### 4. 批量审核评论

```http
POST /admin/comments/batch-approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approve|reject|delete",
  "commentIds": [1, 2, 3, 4],
  "reason": "批量操作理由"
}
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
  "filename": "image_20240115_103045.jpg",
  "originalName": "my-image.jpg",
  "url": "http://localhost:3000/uploads/images/image_20240115_103045.jpg",
  "size": 245760,
  "mimeType": "image/jpeg"
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

### 3. 上传文档

```http
POST /upload/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: 文档文件
```

### 4. 上传视频

```http
POST /upload/video
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: 视频文件
```

### 5. 删除文件

```http
DELETE /upload/file/:filename
Authorization: Bearer <token>
```

## 🔗 友情链接管理

### 1. 获取友链列表（管理员视图）

```http
GET /admin/friend-links
Authorization: Bearer <token>

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- status: 审核状态 (pending|approved|rejected)
- isActive: 是否激活 (true|false)
```

### 2. 审核友链

```http
PATCH /friend-links/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved|rejected",
  "reason": "审核理由"
}
```

### 3. 创建友链

```http
POST /friend-links
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "友链名称",
  "url": "https://example.com",
  "description": "友链描述",
  "logo": "https://example.com/logo.png",
  "email": "contact@example.com"
}
```

### 4. 更新友链

```http
PATCH /friend-links/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的名称",
  "url": "https://newurl.com",
  "isActive": true
}
```

### 5. 删除友链

```http
DELETE /friend-links/:id
Authorization: Bearer <token>
```

### 6. 获取友链统计

```http
GET /friend-links/stats
Authorization: Bearer <token>
```

## 📈 数据统计

### 1. 获取访问统计

```http
GET /admin/dashboard/visit-stats
Authorization: Bearer <token>

Query Parameters:
- period: 统计周期 (day|week|month|year)
- startDate: 开始日期
- endDate: 结束日期
```

### 2. 获取内容统计

```http
GET /admin/dashboard/content-stats
Authorization: Bearer <token>
```

**响应示例：**

```json
{
  "posts": {
    "total": 156,
    "published": 142,
    "draft": 12,
    "archived": 2
  },
  "comments": {
    "total": 234,
    "approved": 220,
    "pending": 12,
    "rejected": 2
  },
  "users": {
    "total": 89,
    "active": 85,
    "inactive": 4
  }
}
```

## 🔍 搜索功能

### 1. 全站搜索

```http
GET /search
Authorization: Bearer <token>

Query Parameters:
- q: 搜索关键词
- type: 搜索类型 (post|user|comment|all)
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
```

### 2. 获取搜索建议

```http
GET /search/suggestions
Authorization: Bearer <token>

Query Parameters:
- q: 搜索关键词
- limit: 返回数量 (默认: 10)
```

## ⚙️ 系统设置

### 1. 获取系统配置

```http
GET /admin/settings
Authorization: Bearer <token>
```

### 2. 更新系统配置

```http
PATCH /admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "siteName": "我的博客",
  "siteDescription": "这是一个技术博客",
  "allowRegistration": true,
  "requireEmailVerification": false,
  "commentModeration": true
}
```

## 📊 错误码说明

| 状态码 | 说明                     |
| ------ | ------------------------ |
| 200    | 请求成功                 |
| 201    | 创建成功                 |
| 400    | 请求参数错误             |
| 401    | 未授权，需要登录         |
| 403    | 权限不足，需要管理员权限 |
| 404    | 资源不存在               |
| 409    | 资源冲突（如重复创建）   |
| 422    | 数据验证失败             |
| 500    | 服务器内部错误           |

## 🔒 权限说明

### 角色权限

- **admin**: 管理员，拥有所有权限
- **user**: 普通用户，只能管理自己的内容

### 接口权限

- 所有 `/admin/*` 路径的接口都需要管理员权限
- 创建、更新、删除分类和标签需要管理员权限
- 文件上传需要登录用户权限
- 评论审核需要管理员权限

## 📝 使用示例

### 完整的管理员操作流程

1. **登录获取Token**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

2. **获取仪表板数据**

```bash
curl -X GET http://localhost:3000/api/v1/admin/dashboard/stats \
  -H "Authorization: Bearer <your-token>"
```

3. **创建分类**

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

4. **获取文章列表**

```bash
curl -X GET "http://localhost:3000/api/v1/admin/posts?page=1&limit=10&status=published" \
  -H "Authorization: Bearer <your-token>"
```

---

**注意事项：**

1. 所有时间格式均为 ISO 8601 标准格式
2. 分页参数：page 从 1 开始，limit 最大值为 100
3. 文件上传大小限制：图片 5MB，文档 10MB，视频 50MB
4. Token 有效期为 7 天，过期后需要重新登录
5. 所有删除操作都是软删除，可以恢复
