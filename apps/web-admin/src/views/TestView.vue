<template>
    <div style="min-height: 100vh; background-color: #f5f5f5; padding: 32px;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h1 style="font-size: 32px; font-weight: bold; color: #333; margin-bottom: 32px;">UI框架测试页面</h1>

            <!-- 原生CSS测试 -->
            <div
                style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 32px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #555; margin-bottom: 16px;">原生CSS 测试</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div
                        style="background: #1890ff; color: white; padding: 16px; border-radius: 8px; text-align: center;">
                        蓝色卡片
                    </div>
                    <div
                        style="background: #52c41a; color: white; padding: 16px; border-radius: 8px; text-align: center;">
                        绿色卡片
                    </div>
                    <div
                        style="background: #ff4d4f; color: white; padding: 16px; border-radius: 8px; text-align: center;">
                        红色卡片
                    </div>
                </div>
            </div>

            <!-- Naive UI测试 -->
            <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #555; margin-bottom: 16px;">Naive UI 测试</h2>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                        <NButton type="primary">主要按钮</NButton>
                        <NButton type="success">成功按钮</NButton>
                        <NButton type="warning">警告按钮</NButton>
                        <NButton type="error">错误按钮</NButton>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                        <NInput v-model:value="inputValue" placeholder="请输入内容" style="width: 200px;" />
                        <NButton @click="showMessage">显示消息</NButton>
                        <NButton @click="showDialog">显示对话框</NButton>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                        <NTag type="info">信息标签</NTag>
                        <NTag type="success">成功标签</NTag>
                        <NTag type="warning">警告标签</NTag>
                        <NTag type="error">错误标签</NTag>
                    </div>

                    <div>
                        <NCard title="卡片标题" style="max-width: 400px;">
                            这是一个Naive UI卡片组件的示例内容。
                            <template #footer>
                                <div style="text-align: right;">
                                    <NButton size="small">操作</NButton>
                                </div>
                            </template>
                        </NCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NInput, NTag, NCard, useMessage, useDialog } from 'naive-ui'

const inputValue = ref('')
const message = useMessage()
const dialog = useDialog()

const showMessage = () => {
    message.success('这是一个成功消息！')
}

const showDialog = () => {
    dialog.info({
        title: '信息',
        content: '这是一个Naive UI对话框！',
        positiveText: '确定'
    })
}
</script>