import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useMessage } from 'naive-ui'

// 创建axios实例
const request: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        // 直接返回完整的响应数据，让各个API自己处理数据结构
        return response.data
    },
    (error) => {
        const message = useMessage()

        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                    message.error('登录已过期，请重新登录')
                    break
                case 403:
                    message.error('权限不足')
                    break
                case 404:
                    message.error('请求的资源不存在')
                    break
                case 422:
                    message.error(data.message || '数据验证失败')
                    break
                case 500:
                    message.error('服务器内部错误')
                    break
                default:
                    message.error(data.message || '请求失败')
            }
        } else if (error.request) {
            message.error('网络错误，请检查网络连接')
        } else {
            message.error('请求配置错误')
        }

        return Promise.reject(error)
    }
)

export default request