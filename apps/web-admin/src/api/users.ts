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

// 用户接口定义
export interface User {
    id: number
    username: string
    email: string
    nickname: string
    avatar?: string
    bio?: string
    role: 'admin' | 'user'
    status: 'active' | 'inactive' | 'banned'
    createdAt: string
    updatedAt: string
    lastLoginAt?: string
}

// 用户列表查询参数
export interface UsersParams {
    page?: number
    limit?: number
    keyword?: string
    role?: 'admin' | 'user'
    status?: 'active' | 'inactive' | 'banned'
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

// 用户列表响应
interface UsersResponse {
    data: User[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

// 创建用户数据
export interface CreateUserData {
    username: string
    email: string
    password: string
    nickname?: string
    avatar?: string
    bio?: string
    role?: 'admin' | 'user'
    status?: 'active' | 'inactive' | 'banned'
}

// 更新用户数据
export interface UpdateUserData {
    nickname?: string
    avatar?: string
    bio?: string
    role?: 'admin' | 'user'
    status?: 'active' | 'inactive' | 'banned'
}

// 修改密码数据
export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

// 用户统计数据
export interface UserStats {
    total: number
    active: number
    banned: number
    newThisMonth: number
}

// 获取用户列表
export const getUsers = async (params: UsersParams): Promise<ApiResponse<UsersResponse>> => {
    return request.get('/users', { params })
}

// 创建用户
export const createUser = async (data: CreateUserData): Promise<User> => {
    const response: ApiResponse<User> = await request.post('/users', data)
    return response.data
}

// 获取用户详情
export const getUser = async (id: number): Promise<User> => {
    const response: ApiResponse<User> = await request.get(`/users/${id}`)
    return response.data
}

// 更新用户信息
export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
    const response: ApiResponse<User> = await request.patch(`/users/${id}`, data)
    return response.data
}

// 删除用户
export const deleteUser = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.delete(`/users/${id}`)
    return response.data
}

// 封禁用户
export const banUser = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.patch(`/users/${id}/ban`)
    return response.data
}

// 解封用户
export const unbanUser = async (id: number): Promise<void> => {
    const response: ApiResponse<void> = await request.patch(`/users/${id}/unban`)
    return response.data
}

// 修改用户密码
export const changePassword = async (id: number, data: ChangePasswordData): Promise<void> => {
    const response: ApiResponse<void> = await request.patch(`/users/${id}/password`, data)
    return response.data
}

// 获取用户统计信息
export const getUserStats = async (): Promise<UserStats> => {
    const response: ApiResponse<UserStats> = await request.get('/users/stats')
    return response.data
}

// 根据用户名获取用户信息
export const getUserByUsername = async (username: string): Promise<User> => {
    const response: ApiResponse<User> = await request.get(`/users/username/${username}`)
    return response.data
}