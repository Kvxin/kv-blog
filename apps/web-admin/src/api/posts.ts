import request from '@/utils/request'

export interface Post {
    id: number
    title: string
    slug: string
    excerpt?: string
    content: string
    status: 'draft' | 'published' | 'archived'
    viewCount: number
    likeCount: number
    commentCount: number
    isTop: boolean
    allowComment: boolean  // 注意：后端返回的是 allowComment，不是 allowComments
    metaTitle?: string | null
    metaDescription?: string | null
    metaKeywords?: string | null
    publishedAt?: string | null
    author: {
        id: number
        username: string
        nickname?: string | null
        email?: string
        avatar?: string | null
        bio?: string | null
        role?: string
        status?: string
        lastLoginAt?: string
        createdAt?: string
        updatedAt?: string
    }
    authorId: number
    category?: {
        id: number
        name: string
    } | null
    categoryId?: number | null
    tags: Array<{
        id: number
        name: string
    }>
    featuredImage?: string | null
    createdAt: string
    updatedAt: string
}

export interface PostsParams {
    page?: number
    limit?: number
    status?: 'draft' | 'published' | 'archived'
    categoryId?: number
    authorId?: number
    // 注意：以下参数暂时被后端拒绝，需要后端修复
    // keyword?: string
    // sortBy?: 'createdAt' | 'updatedAt' | 'viewCount'
    // sortOrder?: 'ASC' | 'DESC'
}

export interface CreatePostData {
    title: string
    content: string
    excerpt?: string
    categoryId?: number
    tagIds?: number[]
    status?: 'draft' | 'published'
    featuredImage?: string
    isTop?: boolean
    allowComments?: boolean
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
}

export interface UpdatePostData extends Partial<CreatePostData> { }

export interface BatchPostAction {
    action: 'delete' | 'publish' | 'archive'
    postIds: number[]
}

// 后端响应结构
interface ApiResponse<T> {
    code: number
    success: boolean
    message: string
    data: T
    timestamp: string
    path: string
}

interface PostsResponse {
    data: Post[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

// 获取文章列表（管理员视图）
export const getPosts = (params: PostsParams): Promise<ApiResponse<PostsResponse>> => {
    return request.get('/admin/posts', { params })
}

// 获取单个文章详情
export const getPost = async (id: number): Promise<Post> => {
    const response: ApiResponse<Post> = await request.get(`/posts/${id}`)
    return response.data
}

// 创建文章
export const createPost = async (data: CreatePostData): Promise<Post> => {
    const response: ApiResponse<Post> = await request.post('/posts', data)
    return response.data
}

// 更新文章
export const updatePost = async (id: number, data: UpdatePostData): Promise<Post> => {
    const response: ApiResponse<Post> = await request.patch(`/posts/${id}`, data)
    return response.data
}

// 删除文章
export const deletePost = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.delete(`/posts/${id}`)
    return response.data
}

// 批量操作文章
export const batchPostAction = async (data: BatchPostAction): Promise<void> => {
    const response: ApiResponse<void> = await request.post('/admin/posts/batch', data)
    return response.data
}