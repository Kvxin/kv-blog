<template>
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80px">
        <n-form-item label="用户名" path="username">
            <n-input v-model:value="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
        </n-form-item>

        <n-form-item label="邮箱" path="email">
            <n-input v-model:value="formData.email" placeholder="请输入邮箱地址" :disabled="isEdit" />
        </n-form-item>

        <n-form-item v-if="!isEdit" label="密码" path="password">
            <n-input v-model:value="formData.password" type="password" placeholder="请输入密码"
                show-password-on="mousedown" />
        </n-form-item>

        <n-form-item label="昵称" path="nickname">
            <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </n-form-item>

        <n-form-item label="头像" path="avatar">
            <n-input v-model:value="formData.avatar" placeholder="请输入头像URL" />
        </n-form-item>

        <n-form-item label="个人简介" path="bio">
            <n-input v-model:value="formData.bio" type="textarea" placeholder="请输入个人简介" :rows="3" />
        </n-form-item>

        <n-form-item label="角色" path="role">
            <n-select v-model:value="formData.role" placeholder="请选择角色" :options="roleOptions" />
        </n-form-item>

        <n-form-item label="状态" path="status">
            <n-select v-model:value="formData.status" placeholder="请选择状态" :options="statusOptions" />
        </n-form-item>

        <n-space justify="end">
            <n-button @click="$emit('cancel')">取消</n-button>
            <n-button type="primary" :loading="loading" @click="handleSubmit">
                {{ isEdit ? '更新' : '创建' }}
            </n-button>
        </n-space>
    </n-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NSpace, NButton, useMessage, type FormInst, type FormRules } from 'naive-ui'
import { createUser, updateUser, type User, type CreateUserData, type UpdateUserData } from '@/api/users'

interface Props {
    user?: User | null
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

// 是否为编辑模式
const isEdit = computed(() => !!props.user)

// 表单数据
const formData = reactive<CreateUserData & { id?: number }>({
    username: '',
    email: '',
    password: '',
    nickname: '',
    avatar: '',
    bio: '',
    role: 'user',
    status: 'active'
})

// 选项配置
const roleOptions = [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' }
]

const statusOptions = [
    { label: '正常', value: 'active' },
    { label: '未激活', value: 'inactive' },
    { label: '已封禁', value: 'banned' }
]

// 表单验证规则
const rules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 50, message: '用户名长度应在3-50个字符之间', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: !isEdit.value, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    nickname: [
        { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }
    ],
    role: [
        { required: true, message: '请选择角色', trigger: 'change' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ]
}

// 监听用户数据变化，填充表单
watch(() => props.user, (user) => {
    if (user) {
        formData.id = user.id
        formData.username = user.username
        formData.email = user.email
        formData.nickname = user.nickname || ''
        formData.avatar = user.avatar || ''
        formData.bio = user.bio || ''
        formData.role = user.role
        formData.status = user.status
    } else {
        // 重置表单
        formData.id = undefined
        formData.username = ''
        formData.email = ''
        formData.password = ''
        formData.nickname = ''
        formData.avatar = ''
        formData.bio = ''
        formData.role = 'user'
        formData.status = 'active'
    }
}, { immediate: true })

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        if (isEdit.value && formData.id) {
            // 编辑用户
            const updateData: UpdateUserData = {
                nickname: formData.nickname || undefined,
                avatar: formData.avatar || undefined,
                bio: formData.bio || undefined,
                role: formData.role,
                status: formData.status
            }
            await updateUser(formData.id, updateData)
        } else {
            // 创建用户
            const createData: CreateUserData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname || undefined,
                avatar: formData.avatar || undefined,
                bio: formData.bio || undefined,
                role: formData.role,
                status: formData.status
            }
            await createUser(createData)
        }

        emit('success')
    } catch (error) {
        console.error('Form submission error:', error)
        message.error(isEdit.value ? '更新用户失败' : '创建用户失败')
    } finally {
        loading.value = false
    }
}
</script>