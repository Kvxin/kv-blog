import request from '@/utils/request'

export interface LoginParams {
    email: string
    password: string
}

export interface LoginResponse {
    user: {
        id: number
        username: string
        email: string
        nickname: string
        role: string
        status: string
    }
    token: string
}

export interface UserProfile {
    id: number
    username: string
    email: string
    nickname: string
    role: string
    status: string
}

// API响应包装类型
interface ApiResponse<T> {
    code: number
    success: boolean
    message: string
    data: T
    timestamp: string
    path: string
}

// 登录
export const login = async (data: LoginParams): Promise<LoginResponse> => {
    const response: ApiResponse<LoginResponse> = await request.post('/auth/login', data)
    return response.data
}

// 获取当前用户信息
export const getProfile = async (): Promise<UserProfile> => {
    const response: ApiResponse<UserProfile> = await request.get('/auth/profile')
    return response.data
}

// 登出
export const logout = async (): Promise<void> => {
    const response: ApiResponse<void> = await request.post('/auth/logout')
    return response.data
}