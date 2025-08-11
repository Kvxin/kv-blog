// 系统健康状态接口定义
export interface SystemHealth {
  version?: string
  uptime?: number
  environment?: string
  database?: {
    status: 'connected' | 'disconnected'
    responseTime?: number
  }
  memory?: {
    used: number
    total: number
    percentage: number
  }
  disk?: {
    used: number
    total: number
    percentage: number
  }
}

// 系统日志接口定义
export interface SystemLog {
  id: number
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  timestamp: string
  context?: any
}

// 备份信息接口定义
export interface BackupInfo {
  id: number
  filename: string
  size: number
  createdAt: string
  status: 'completed' | 'failed' | 'in_progress'
}