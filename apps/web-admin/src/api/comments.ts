import request from '@/utils/request'

// API响应包装类型
interface ApiResponse<T> {
    code: number
    success: boolean
    message: string
    data: T
    timestamp: string
    path: string
}

// 评论接口定义
export interface Comment {
    id: number
    content: string
    status: 'pending' | 'approved' | 'rejected'
    likeCount: number
    ipAddress: string
    userAgent: string
    author: {
        id: number
        username: string
        nickname: string
        avatar?: string
    }
    post: {
        id: number
        title: string
        slug: string
    }
    parentId?: number
    replyCount: number
    createdAt: string
    updatedAt: string
}

// 评论列表查询参数
export interface CommentsParams {
    page?: number
    limit?: number
    postId?: number
    status?: 'pending' | 'approved' | 'rejected'
    authorId?: number
    parentId?: number
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

// 管理员评论查询参数
export interface AdminCommentsParams {
    page?: number
    limit?: number
    status?: 'pending' | 'approved' | 'rejected'
    startDate?: string
    endDate?: string
}

// 评论列表响应
interface CommentsResponse {
    data: Comment[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// 创建评论数据
export interface CreateCommentData {
    content: string
    postId: number
    parentId?: number
}

// 更新评论数据
export interface UpdateCommentData {
    content?: string
    status?: 'pending' | 'approved' | 'rejected'
}

// 批量审核评论数据
export interface BatchCommentAction {
    action: 'approve' | 'reject' | 'delete'
    commentIds: number[]
    reason?: string
}

// 获取评论列表
export const getComments = async (params: CommentsParams): Promise<ApiResponse<CommentsResponse>> => {
    return request.get('/comments', { params })
}

// 管理员获取评论列表
export const getAdminComments = async (params: AdminCommentsParams): Promise<ApiResponse<CommentsResponse>> => {
    return request.get('/admin/comments', { params })
}

// 获取文章的评论
export const getPostComments = async (postId: number, includeReplies: boolean = true): Promise<Comment[]> => {
    const response: ApiResponse<Comment[]> = await request.get(`/comments/post/${postId}`, {
        params: { includeReplies }
    })
    return response.data
}

// 创建评论
export const createComment = async (data: CreateCommentData): Promise<Comment> => {
    const response: ApiResponse<Comment> = await request.post('/comments', data)
    return response.data
}

// 更新评论
export const updateComment = async (id: number, data: UpdateCommentData): Promise<Comment> => {
    const response: ApiResponse<Comment> = await request.patch(`/comments/${id}`, data)
    return response.data
}

// 删除评论
export const deleteComment = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.delete(`/comments/${id}`)
    return response.data
}

// 审核通过评论
export const approveComment = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.patch(`/comments/${id}/approve`)
    return response.data
}

// 拒绝评论
export const rejectComment = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.patch(`/comments/${id}/reject`)
    return response.data
}

// 批量审核评论
export const batchCommentAction = async (data: BatchCommentAction): Promise<void> => {
    const response: ApiResponse<void> = await request.post('/admin/comments/batch-approve', data)
    return response.data
}