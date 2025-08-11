<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900">KV Blog 后台管理</h2>
                <p class="mt-2 text-sm text-gray-600">请登录您的管理员账户</p>
            </div>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <NForm ref="formRef" :model="formData" :rules="rules" size="large" @submit.prevent="handleSubmit">
                    <NFormItem path="email" label="邮箱">
                        <NInput v-model:value="formData.email" placeholder="请输入邮箱"
                            :input-props="{ autocomplete: 'email', type: 'email' }" />
                    </NFormItem>

                    <NFormItem path="password" label="密码">
                        <NInput v-model:value="formData.password" placeholder="请输入密码" type="password"
                            show-password-on="mousedown" :input-props="{ autocomplete: 'current-password' }" />
                    </NFormItem>

                    <div class="mt-6">
                        <NButton type="primary" size="large" :loading="loading" :disabled="loading" attr-type="submit"
                            block>
                            {{ loading ? '登录中...' : '登录' }}
                        </NButton>
                    </div>
                </NForm>

                <div class="mt-6">
                    <div class="text-center text-sm text-gray-500">
                        <p>测试账户：admin@example.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formData = reactive({
    email: 'admin@example.com',
    password: 'admin123'
})

const rules: FormRules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ]
}

const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        const response = await userStore.login(formData)
        console.log('Login response:', response)
        console.log('User store state:', {
            isLoggedIn: userStore.isLoggedIn,
            user: userStore.user,
            token: userStore.token
        })

        message.success('登录成功')

        // 确保状态更新后再跳转
        await nextTick()
        router.push('/dashboard')
    } catch (error: any) {
        if (error.errors) {
            // 表单验证错误
            return
        }

        // API错误已经在axios拦截器中处理了
        console.error('Login error:', error)
    } finally {
        loading.value = false
    }
}
</script>