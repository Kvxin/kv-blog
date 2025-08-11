<template>
    <div style="padding: 24px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">API参数测试工具</h1>

        <div style="margin-bottom: 24px;">
            <NButton type="primary" @click="runTests" :loading="testing">
                运行API测试
            </NButton>
            <NButton style="margin-left: 12px;" @click="clearResults">
                清除结果
            </NButton>
        </div>

        <div v-if="testResults.length > 0"
            style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">测试结果</h2>

            <div v-for="(result, index) in testResults" :key="index"
                style="margin-bottom: 16px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 6px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; margin-right: 12px;">测试 {{ index + 1 }}:</span>
                    <NTag :type="result.success ? 'success' : 'error'">
                        {{ result.success ? '成功' : '失败' }}
                    </NTag>
                </div>

                <div style="margin-bottom: 8px;">
                    <strong>接口:</strong> {{ result.method }} {{ result.endpoint }}
                </div>

                <div style="margin-bottom: 8px;">
                    <strong>参数:</strong>
                    <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">
            {{ JSON.stringify(result.params || result.body, null, 2) }}
          </code>
                </div>

                <div v-if="!result.success" style="color: #d32f2f;">
                    <strong>错误:</strong> {{ result.error }}
                </div>

                <div v-if="result.success && result.response" style="margin-top: 8px;">
                    <strong>响应数据:</strong>
                    <details style="margin-top: 4px;">
                        <summary style="cursor: pointer; color: #1976d2;">查看响应详情</summary>
                        <pre
                            style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin-top: 8px;">{{ JSON.stringify(result.response, null, 2) }}</pre>
                    </details>
                </div>
            </div>

            <div v-if="suggestions.length > 0"
                style="margin-top: 24px; padding: 16px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #856404;">🔧 修复建议</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li v-for="suggestion in suggestions" :key="suggestion" style="margin-bottom: 4px; color: #856404;">
                        {{ suggestion }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import { testPostsApi, printTestResults, generateApiFixSuggestions, type ApiTestResult } from '@/utils/api-test'

const message = useMessage()
const testing = ref(false)
const testResults = ref<ApiTestResult[]>([])
const suggestions = ref<string[]>([])

const runTests = async () => {
    try {
        testing.value = true
        message.info('开始运行API测试...')

        const results = await testPostsApi()
        testResults.value = results

        // 在控制台打印详细结果
        printTestResults(results)
        generateApiFixSuggestions(results)

        // 生成修复建议
        const failedTests = results.filter(r => !r.success)
        suggestions.value = []

        if (failedTests.some(t => t.params?.keyword)) {
            suggestions.value.push('后端需要添加对 keyword 参数的支持（用于搜索文章标题）')
        }
        if (failedTests.some(t => t.params?.sortBy || t.params?.sortOrder)) {
            suggestions.value.push('后端需要添加对 sortBy 和 sortOrder 参数的支持（用于排序）')
        }

        if (failedTests.length === 0) {
            message.success('所有API测试都通过了！')
        } else {
            message.warning(`${failedTests.length} 个测试失败，请查看详细结果`)
        }

    } catch (error) {
        console.error('测试过程中出错:', error)
        message.error('测试过程中出错，请查看控制台')
    } finally {
        testing.value = false
    }
}

const clearResults = () => {
    testResults.value = []
    suggestions.value = []
    message.info('已清除测试结果')
}
</script>