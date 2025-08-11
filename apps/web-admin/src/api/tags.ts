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

// 标签接口定义
export interface Tag {
    id: number
    name: string
    slug: string
    description?: string
    color?: string
    isActive: boolean
    postCount: number
    createdAt: string
    updatedAt: string
}

// 标签列表查询参数
export interface TagsParams {
    page?: number
    limit?: number
    keyword?: string
    isActive?: boolean
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

// 标签列表响应
interface TagsResponse {
    data: Tag[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// 创建标签数据
export interface CreateTagData {
    name: string
    slug: string
    description?: string
    color?: string
    isActive?: boolean
}

// 更新标签数据
export interface UpdateTagData {
    name?: string
    slug?: string
    description?: string
    color?: string
    isActive?: boolean
}

// 获取标签列表
export const getTags = async (params: TagsParams): Promise<ApiResponse<TagsResponse>> => {
    return request.get('/tags', { params })
}

// 创建标签
export const createTag = async (data: CreateTagData): Promise<Tag> => {
    const response: ApiResponse<Tag> = await request.post('/tags', data)
    return response.data
}

// 获取标签详情
export const getTag = async (id: number): Promise<Tag> => {
    const response: ApiResponse<Tag> = await request.get(`/tags/${id}`)
    return response.data
}

// 根据别名获取标签详情
export const getTagBySlug = async (slug: string): Promise<Tag> => {
    const response: ApiResponse<Tag> = await request.get(`/tags/slug/${slug}`)
    return response.data
}

// 更新标签
export const updateTag = async (id: number, data: UpdateTagData): Promise<Tag> => {
    const response: ApiResponse<Tag> = await request.patch(`/tags/${id}`, data)
    return response.data
}

// 删除标签
export const deleteTag = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.delete(`/tags/${id}`)
    return response.data
}

// 获取启用的标签列表
export const getActiveTags = async (): Promise<Tag[]> => {
    const response: ApiResponse<Tag[]> = await request.get('/tags/active')
    return response.data
}

// 获取热门标签
export const getPopularTags = async (limit: number = 10): Promise<Tag[]> => {
    const response: ApiResponse<Tag[]> = await request.get('/tags/popular', { params: { limit } })
    return response.data
}