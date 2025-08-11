<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <div class="text-9xl font-bold text-gray-300 mb-4">404</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">页面未找到</h1>
            <p class="text-gray-600 mb-8">抱歉，您访问的页面不存在。</p>
            <NButton type="primary" @click="goHome">
                返回首页
            </NButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/dashboard')
}
</script>