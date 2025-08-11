<template>
    <div style="padding: 24px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">文章数据调试页面</h1>

        <div style="margin-bottom: 16px;">
            <NButton type="primary" @click="fetchData" :loading="loading">
                获取文章数据
            </NButton>
        </div>

        <div v-if="rawResponse" style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">原始响应数据：</h3>
            <pre
                style="background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(rawResponse, null, 2) }}</pre>
        </div>

        <div v-if="processedData.length > 0" style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">处理后的数据：</h3>
            <div v-for="post in processedData" :key="post.id"
                style="border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; margin-bottom: 12px;">
                <div style="font-weight: 600; margin-bottom: 8px;">{{ post.title }}</div>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 14px;">
                    <div><strong>ID:</strong> {{ post.id }}</div>
                    <div><strong>状态:</strong> {{ post.status }}</div>
                    <div><strong>作者:</strong> {{ post.author?.nickname || post.author?.username }}</div>
                    <div><strong>分类:</strong> {{ post.category?.name || '未分类' }}</div>
                    <div><strong>置顶:</strong> {{ post.isTop ? '是' : '否' }}</div>
                    <div><strong>允许评论:</strong> {{ post.allowComment ? '是' : '否' }}</div>
                    <div><strong>浏览量:</strong> {{ post.viewCount }}</div>
                    <div><strong>创建时间:</strong> {{ new Date(post.createdAt).toLocaleString('zh-CN') }}</div>
                </div>
            </div>
        </div>

        <div v-if="error" style="color: #d32f2f; background: #ffebee; padding: 12px; border-radius: 6px;">
            <strong>错误:</strong> {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { getPosts, type Post } from '@/api/posts'

const message = useMessage()
const loading = ref(false)
const rawResponse = ref<any>(null)
const processedData = ref<Post[]>([])
const error = ref<string>('')

const fetchData = async () => {
    try {
        loading.value = true
        error.value = ''

        const response = await getPosts({ page: 1, limit: 20 })
        rawResponse.value = response

        console.log('Debug - Full response:', response)

        // 处理后端返回的嵌套数据结构
        if (response.success && response.data) {
            processedData.value = response.data.data || []
            console.log('Debug - Processed data:', processedData.value)
        } else {
            console.error('Debug - API response format error:', response)
            processedData.value = []
        }

        message.success(`成功获取 ${processedData.value.length} 条数据`)
    } catch (err: any) {
        error.value = err.message || err.toString()
        message.error('获取数据失败')
        console.error('Failed to fetch posts:', err)
    } finally {
        loading.value = false
    }
}
</script>