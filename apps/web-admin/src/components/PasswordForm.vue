<template>
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="100px">
        <n-form-item label="当前密码" path="currentPassword">
            <n-input v-model:value="formData.currentPassword" type="password" placeholder="请输入当前密码"
                show-password-on="mousedown" />
        </n-form-item>

        <n-form-item label="新密码" path="newPassword">
            <n-input v-model:value="formData.newPassword" type="password" placeholder="请输入新密码"
                show-password-on="mousedown" />
        </n-form-item>

        <n-form-item label="确认新密码" path="confirmPassword">
            <n-input v-model:value="formData.confirmPassword" type="password" placeholder="请再次输入新密码"
                show-password-on="mousedown" />
        </n-form-item>

        <n-space justify="end">
            <n-button @click="$emit('cancel')">取消</n-button>
            <n-button type="primary" :loading="loading" @click="handleSubmit">
                修改密码
            </n-button>
        </n-space>
    </n-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NForm, NFormItem, NInput, NSpace, NButton, useMessage, type FormInst, type FormRules } from 'naive-ui'
import { changePassword, type ChangePasswordData } from '@/api/users'

interface Props {
    userId?: number
}

interface Emits {
    (e: 'success'): void
    (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 表单数据
const formData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 表单验证规则
const rules: FormRules = {
    currentPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule, value) => {
                if (value !== formData.newPassword) {
                    return new Error('两次输入的密码不一致')
                }
                return true
            },
            trigger: 'blur'
        }
    ]
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value || !props.userId) return

    try {
        await formRef.value.validate()
        loading.value = true

        const passwordData: ChangePasswordData = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }

        await changePassword(props.userId, passwordData)

        // 重置表单
        formData.currentPassword = ''
        formData.newPassword = ''
        formData.confirmPassword = ''

        emit('success')
    } catch (error) {
        console.error('Password change error:', error)
        message.error('密码修改失败')
    } finally {
        loading.value = false
    }
}
</script>