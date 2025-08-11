<template>
    <div style="padding: 24px;">
        <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: #666; margin-bottom: 16px;">编辑文章页面</h2>
            <p style="color: #999; margin-bottom: 24px;">此页面正在开发中...</p>
            <NButton type="primary" @click="$router.push('/posts')">
                返回文章列表
            </NButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>