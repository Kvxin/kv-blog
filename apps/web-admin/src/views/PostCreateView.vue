<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">创建文章</h1>
                <p class="text-gray-600">创建新的博客文章</p>
            </div>
            <NButton @click="$router.back()">返回</NButton>
        </div>

        <NCard>
            <div class="flex items-center justify-center h-64 text-gray-500">
                <div class="text-center">
                    <div class="text-4xl mb-2">📝</div>
                    <p>文章创建页面</p>
                    <p class="text-sm">功能开发中...</p>
                </div>
            </div>
        </NCard>
    </div>
</template>

<script setup lang="ts">
import { NCard, NButton } from 'naive-ui'
</script>