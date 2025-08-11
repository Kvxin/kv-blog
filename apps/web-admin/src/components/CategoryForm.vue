<template>
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80px">
        <n-form-item label="分类名称" path="name">
            <n-input v-model:value="formData.name" placeholder="请输入分类名称" />
        </n-form-item>

        <n-form-item label="别名" path="slug">
            <n-input v-model:value="formData.slug" placeholder="请输入URL友好的别名" />
        </n-form-item>

        <n-form-item label="描述" path="description">
            <n-input v-model:value="formData.description" type="textarea" placeholder="请输入分类描述" :rows="3" />
        </n-form-item>

        <n-form-item label="颜色" path="color">
            <n-space align="center">
                <n-color-picker v-model:value="formData.color" :show-alpha="false" :modes="['hex']" />
                <n-input v-model:value="formData.color" placeholder="#3498db" style="width: 120px" />
            </n-space>
        </n-form-item>

        <n-form-item label="排序权重" path="sort">
            <n-input-number v-model:value="formData.sort" placeholder="数字越小排序越靠前" :min="0" :max="9999"
                style="width: 200px" />
        </n-form-item>

        <n-form-item label="状态" path="isActive">
            <n-switch v-model:value="formData.isActive" :checked-value="true" :unchecked-value="false">
                <template #checked>启用</template>
                <template #unchecked>禁用</template>
            </n-switch>
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
import {
    NForm, NFormItem, NInput, NInputNumber, NColorPicker, NSwitch,
    NSpace, NButton, useMessage, type FormInst, type FormRules
} from 'naive-ui'
import { createCategory, updateCategory, type Category, type CreateCategoryData, type UpdateCategoryData } from '@/api/categories'

interface Props {
    category?: Category | null
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
const isEdit = computed(() => !!props.category)

// 表单数据
const formData = reactive<CreateCategoryData & { id?: number }>({
    name: '',
    slug: '',
    description: '',
    color: '#3498db',
    sort: 0,
    isActive: true
})

// 表单验证规则
const rules: FormRules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { max: 50, message: '分类名称长度不能超过50个字符', trigger: 'blur' }
    ],
    slug: [
        { required: true, message: '请输入别名', trigger: 'blur' },
        { max: 100, message: '别名长度不能超过100个字符', trigger: 'blur' },
        {
            pattern: /^[a-z0-9-]+$/,
            message: '别名只能包含小写字母、数字和连字符',
            trigger: 'blur'
        }
    ],
    color: [
        {
            pattern: /^#[0-9A-Fa-f]{6}$/,
            message: '请输入有效的十六进制颜色值',
            trigger: 'blur'
        }
    ],
    sort: [
        { type: 'number', message: '排序权重必须是数字', trigger: 'blur' }
    ]
}

// 监听分类数据变化，填充表单
watch(() => props.category, (category) => {
    if (category) {
        formData.id = category.id
        formData.name = category.name
        formData.slug = category.slug
        formData.description = category.description || ''
        formData.color = category.color || '#3498db'
        formData.sort = category.sort
        formData.isActive = category.isActive
    } else {
        // 重置表单
        formData.id = undefined
        formData.name = ''
        formData.slug = ''
        formData.description = ''
        formData.color = '#3498db'
        formData.sort = 0
        formData.isActive = true
    }
}, { immediate: true })

// 自动生成别名
watch(() => formData.name, (name) => {
    if (!isEdit.value && name) {
        // 简单的拼音转换（实际项目中可能需要更完善的转换）
        const slug = name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')

        if (slug) {
            formData.slug = slug
        }
    }
})

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        if (isEdit.value && formData.id) {
            // 编辑分类
            const updateData: UpdateCategoryData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                color: formData.color || undefined,
                sort: formData.sort,
                isActive: formData.isActive
            }
            await updateCategory(formData.id, updateData)
        } else {
            // 创建分类
            const createData: CreateCategoryData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                color: formData.color || undefined,
                sort: formData.sort,
                isActive: formData.isActive
            }
            await createCategory(createData)
        }

        emit('success')
    } catch (error) {
        console.error('Form submission error:', error)
        message.error(isEdit.value ? '更新分类失败' : '创建分类失败')
    } finally {
        loading.value = false
    }
}
</script>