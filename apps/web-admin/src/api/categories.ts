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

// 分类接口定义
export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    color?: string
    sort: number
    isActive: boolean
    postCount: number
    createdAt: string
    updatedAt: string
}

// 分类列表查询参数
export interface CategoriesParams {
    page?: number
    limit?: number
    keyword?: string
    isActive?: boolean
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

// 分类列表响应
interface CategoriesResponse {
    data: Category[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// 创建分类数据
export interface CreateCategoryData {
    name: string
    slug: string
    description?: string
    color?: string
    sort?: number
    isActive?: boolean
}

// 更新分类数据
export interface UpdateCategoryData {
    name?: string
    slug?: string
    description?: string
    color?: string
    sort?: number
    isActive?: boolean
}

// 获取分类列表
export const getCategories = async (params: CategoriesParams): Promise<ApiResponse<CategoriesResponse>> => {
    return request.get('/categories', { params })
}

// 创建分类
export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
    const response: ApiResponse<Category> = await request.post('/categories', data)
    return response.data
}

// 获取分类详情
export const getCategory = async (id: number): Promise<Category> => {
    const response: ApiResponse<Category> = await request.get(`/categories/${id}`)
    return response.data
}

// 根据别名获取分类详情
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
    const response: ApiResponse<Category> = await request.get(`/categories/slug/${slug}`)
    return response.data
}

// 更新分类
export const updateCategory = async (id: number, data: UpdateCategoryData): Promise<Category> => {
    const response: ApiResponse<Category> = await request.patch(`/categories/${id}`, data)
    return response.data
}

// 删除分类
export const deleteCategory = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.delete(`/categories/${id}`)
    return response.data
}

// 获取启用的分类列表
export const getActiveCategories = async (): Promise<Category[]> => {
    const response: ApiResponse<Category[]> = await request.get('/categories/active')
    return response.data
}