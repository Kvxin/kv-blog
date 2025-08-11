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

// 系统配置接口定义
export interface SystemConfig {
    siteTitle: string
    siteDescription: string
    siteKeywords: string
    allowRegistration: boolean
    requireCommentApproval: boolean
    postsPerPage: number
    maxFileSize: number
}

// 更新系统配置数据
export interface UpdateSystemConfigData {
    siteTitle?: string
    siteDescription?: string
    siteKeywords?: string
    allowRegistration?: boolean
    requireCommentApproval?: boolean
    postsPerPage?: number
    maxFileSize?: number
}

// 系统健康状态
export interface SystemHealth {
    status: 'healthy' | 'warning' | 'error'
    uptime: number
    memory: {
        used: number
        total: number
        percentage: number
    }
    cpu: {
        usage: number
    }
    disk: {
        used: number
        total: number
        percentage: number
    }
    database: {
        status: 'connected' | 'disconnected'
        responseTime: number
    }
}

// 系统日志
export interface SystemLog {
    id: number
    level: 'info' | 'warn' | 'error' | 'debug'
    message: string
    timestamp: string
    context?: any
}

// 备份信息
export interface BackupInfo {
    id: number
    filename: string
    size: number
    createdAt: string
    status: 'completed' | 'failed' | 'in_progress'
}

// 获取系统配置
export const getSystemConfig = async (): Promise<SystemConfig> => {
    const response: ApiResponse<SystemConfig> = await request.get('/admin/system/config')
    return response.data
}

// 更新系统配置
export const updateSystemConfig = async (data: UpdateSystemConfigData): Promise<SystemConfig> => {
    const response: ApiResponse<SystemConfig> = await request.patch('/admin/system/config', data)
    return response.data
}

// 获取系统健康状态
export const getSystemHealth = async (): Promise<SystemHealth> => {
    const response: ApiResponse<SystemHealth> = await request.get('/admin/system/health')
    return response.data
}

// 获取系统日志
export const getSystemLogs = async (params?: {
    page?: number
    limit?: number
    level?: string
}): Promise<{
    data: SystemLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}> => {
    const response: ApiResponse<{
        data: SystemLog[]
        total: number
        page: number
        limit: number
        totalPages: number
    }> = await request.get('/admin/system/logs', { params })
    return response.data
}

// 系统备份
export const createSystemBackup = async (): Promise<BackupInfo> => {
    const response: ApiResponse<BackupInfo> = await request.post('/admin/system/backup')
    return response.data
}

// 获取备份列表
export const getBackupList = async (): Promise<BackupInfo[]> => {
    const response: ApiResponse<BackupInfo[]> = await request.get('/admin/system/backups')
    return response.data
}

// 清理系统缓存
export const clearSystemCache = async (): Promise<void> => {
    const response: ApiResponse<void> = await request.delete('/admin/system/cache')
    return response.data
}

// 重建搜索索引
export const rebuildSearchIndex = async (): Promise<void> => {
    const response: ApiResponse<void> = await request.post('/admin/system/reindex')
    return response.data
}