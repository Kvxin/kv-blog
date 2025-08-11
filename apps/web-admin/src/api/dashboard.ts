import request from '@/utils/request'

export interface DashboardStats {
    totalPosts: number
    totalUsers: number
    totalComments: number
    totalCategories: number
    totalTags: number
    recentStats: {
        postsThisMonth: number
        usersThisMonth: number
        commentsThisMonth: number
    }
    popularPosts: Array<{
        id: number
        title: string
        viewCount: number
        likeCount: number
    }>
}

export interface ActivityLog {
    id: number
    type: string
    description: string
    user: {
        id: number
        username: string
        nickname: string
    }
    createdAt: string
}

export interface ActivityParams {
    page?: number
    limit?: number
    type?: string
    startDate?: string
    endDate?: string
}

export interface VisitStats {
    period: 'day' | 'week' | 'month' | 'year'
    data: Array<{
        date: string
        visits: number
        pageViews: number
    }>
}

export interface ContentStats {
    posts: {
        total: number
        published: number
        draft: number
        archived: number
    }
    comments: {
        total: number
        approved: number
        pending: number
        rejected: number
    }
    users: {
        total: number
        active: number
        inactive: number
    }
}

// 获取仪表板统计数据
export const getDashboardStats = (): Promise<DashboardStats> => {
    return request.get('/admin/dashboard/stats')
}

// 获取系统活动日志
export const getActivities = (params: ActivityParams): Promise<{
    data: ActivityLog[]
    total: number
    page: number
    limit: number
}> => {
    return request.get('/admin/dashboard/activities', { params })
}

// 获取访问统计
export const getVisitStats = (params: {
    period: 'day' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
}): Promise<VisitStats> => {
    return request.get('/admin/dashboard/visit-stats', { params })
}

// 获取内容统计
export const getContentStats = (): Promise<ContentStats> => {
    return request.get('/admin/dashboard/content-stats')
}