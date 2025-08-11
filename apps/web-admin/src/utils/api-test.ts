// API测试工具 - 用于验证后端API参数支持情况
import request from './request'

export interface ApiTestResult {
    endpoint: string
    method: string
    params?: Record<string, any>
    body?: Record<string, any>
    success: boolean
    error?: string
    response?: any
}

// 测试文章列表API的不同参数组合
export const testPostsApi = async (): Promise<ApiTestResult[]> => {
    const results: ApiTestResult[] = []

    // 测试1: 只有基础参数
    try {
        const response = await request.get('/admin/posts', {
            params: { page: 1, limit: 10 }
        })
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10 },
            success: true,
            response: response
        })
    } catch (error: any) {
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10 },
            success: false,
            error: error.message || error.toString()
        })
    }

    // 测试2: 添加status参数
    try {
        const response = await request.get('/admin/posts', {
            params: { page: 1, limit: 10, status: 'published' }
        })
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, status: 'published' },
            success: true,
            response: response
        })
    } catch (error: any) {
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, status: 'published' },
            success: false,
            error: error.message || error.toString()
        })
    }

    // 测试3: 添加keyword参数（预期失败）
    try {
        const response = await request.get('/admin/posts', {
            params: { page: 1, limit: 10, keyword: 'test' }
        })
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, keyword: 'test' },
            success: true,
            response: response
        })
    } catch (error: any) {
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, keyword: 'test' },
            success: false,
            error: error.message || error.toString()
        })
    }

    // 测试4: 添加sortBy和sortOrder参数（预期失败）
    try {
        const response = await request.get('/admin/posts', {
            params: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' }
        })
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' },
            success: true,
            response: response
        })
    } catch (error: any) {
        results.push({
            endpoint: '/admin/posts',
            method: 'GET',
            params: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' },
            success: false,
            error: error.message || error.toString()
        })
    }

    return results
}

// 打印测试结果
export const printTestResults = (results: ApiTestResult[]) => {
    console.group('🧪 API参数支持测试结果')

    results.forEach((result, index) => {
        console.group(`测试 ${index + 1}: ${result.method} ${result.endpoint}`)
        console.log('参数:', result.params || result.body)
        console.log('状态:', result.success ? '✅ 成功' : '❌ 失败')

        if (result.success) {
            console.log('响应数据:', result.response)
        } else {
            console.log('错误信息:', result.error)
        }

        console.groupEnd()
    })

    console.groupEnd()
}

// 生成API修复建议
export const generateApiFixSuggestions = (results: ApiTestResult[]) => {
    const failedTests = results.filter(r => !r.success)

    if (failedTests.length === 0) {
        console.log('🎉 所有API测试都通过了！')
        return
    }

    console.group('🔧 后端API修复建议')

    failedTests.forEach(test => {
        if (test.params?.keyword) {
            console.log('• 需要在后端添加对 keyword 参数的支持（用于搜索文章标题）')
        }
        if (test.params?.sortBy || test.params?.sortOrder) {
            console.log('• 需要在后端添加对 sortBy 和 sortOrder 参数的支持（用于排序）')
        }
    })

    console.log('\n建议后端开发者：')
    console.log('1. 检查 /admin/posts 接口的参数验证规则')
    console.log('2. 确保支持API文档中列出的所有Query Parameters')
    console.log('3. 更新参数验证schema以包含可选的搜索和排序参数')

    console.groupEnd()
}