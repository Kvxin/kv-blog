<template>
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80px">
        <n-form-item label="评论内容" path="content">
            <n-input v-model:value="formData.content" type="textarea" placeholder="请输入评论内容" :rows="6" :maxlength="1000"
                show-count />
        </n-form-item>

        <n-form-item label="审核状态" path="status">
            <n-select v-model:value="formData.status" placeholder="请选择审核状态" :options="statusOptions" />
        </n-form-item>

        <n-space justify="end">
            <n-button @click="$emit('cancel')">取消</n-button>
            <n-button type="primary" :loading="loading" @click="handleSubmit">
                更新评论
            </n-button>
        </n-space>
    </n-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
    NForm, NFormItem, NInput, NSelect, NSpace, NButton,
    useMessage, type FormInst, type FormRules
} from 'naive-ui'
import { updateComment, type Comment, type UpdateCommentData } from '@/api/comments'

interface Props {
    comment?: Comment | null
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
const formData = reactive<UpdateCommentData & { id?: number }>({
    content: '',
    status: 'pending'
})

// 选项配置
const statusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' }
]

// 表单验证规则
const rules: FormRules = {
    content: [
        { required: true, message: '请输入评论内容', trigger: 'blur' },
        { max: 1000, message: '评论内容不能超过1000个字符', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择审核状态', trigger: 'change' }
    ]
}

// 监听评论数据变化，填充表单
watch(() => props.comment, (comment) => {
    if (comment) {
        formData.id = comment.id
        formData.content = comment.content
        formData.status = comment.status
    } else {
        // 重置表单
        formData.id = undefined
        formData.content = ''
        formData.status = 'pending'
    }
}, { immediate: true })

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value || !formData.id) return

    try {
        await formRef.value.validate()
        loading.value = true

        const updateData: UpdateCommentData = {
            content: formData.content,
            status: formData.status
        }

        await updateComment(formData.id, updateData)
        emit('success')
    } catch (error) {
        console.error('Form submission error:', error)
        message.error('更新评论失败')
    } finally {
        loading.value = false
    }
}
</script>