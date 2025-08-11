<template>
    <div style="padding: 24px;">
        <!-- 页面头部 -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #333;">创建文章</h1>
                <p style="color: #666; margin: 8px 0 0 0;">编写新的博客文章</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <NButton @click="handleSaveDraft" :loading="saving">
                    保存草稿
                </NButton>
                <NButton type="primary" @click="handlePublish" :loading="publishing">
                    发布文章
                </NButton>
            </div>
        </div>

        <!-- 文章表单 -->
        <div style="display: grid; grid-template-columns: 1fr 320px; gap: 24px;">
            <!-- 主要内容区域 -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- 文章标题 -->
                <NCard title="基本信息">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <NFormItem label="文章标题" required>
                            <NInput v-model:value="form.title" placeholder="请输入文章标题" :maxlength="100" show-count
                                clearable />
                        </NFormItem>

                        <NFormItem label="文章摘要">
                            <NInput v-model:value="form.excerpt" type="textarea" placeholder="请输入文章摘要（可选，如不填写将自动从内容中提取）"
                                :maxlength="300" show-count :rows="3" clearable />
                        </NFormItem>
                    </div>
                </NCard>

                <!-- Markdown 编辑器 -->
                <NCard title="文章内容">
                    <v-md-editor v-model="form.content" height="600px" :disabled-menus="[]"
                        @upload-image="handleUploadImage" @save="handleSave"
                        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save"
                        right-toolbar="preview toc sync-scroll fullscreen" />
                </NCard>
            </div>

            <!-- 侧边栏 -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- 发布设置 -->
                <NCard title="发布设置" size="small">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <NFormItem label="文章状态">
                            <NSelect v-model:value="form.status" :options="statusOptions" placeholder="选择文章状态" />
                        </NFormItem>

                        <NFormItem label="是否置顶">
                            <NSwitch v-model:value="form.isTop" />
                        </NFormItem>

                        <NFormItem label="允许评论">
                            <NSwitch v-model:value="form.allowComments" />
                        </NFormItem>
                    </div>
                </NCard>

                <!-- 分类和标签 -->
                <NCard title="分类标签" size="small">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <NFormItem label="文章分类">
                            <NSelect v-model:value="form.categoryId" :options="categoryOptions" placeholder="选择文章分类"
                                clearable filterable />
                        </NFormItem>

                        <NFormItem label="文章标签">
                            <NSelect v-model:value="form.tagIds" :options="tagOptions" placeholder="选择文章标签" multiple
                                clearable filterable max-tag-count="responsive" />
                        </NFormItem>
                    </div>
                </NCard>

                <!-- 特色图片 -->
                <NCard title="特色图片" size="small">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div v-if="form.featuredImage" style="position: relative;">
                            <img :src="form.featuredImage" alt="特色图片预览"
                                style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px;" />
                            <NButton size="small" type="error" @click="form.featuredImage = ''"
                                style="position: absolute; top: 8px; right: 8px;">
                                删除
                            </NButton>
                        </div>

                        <NUpload :show-file-list="false" :custom-request="handleFeaturedImageUpload" accept="image/*">
                            <NButton style="width: 100%;" :loading="uploadingFeaturedImage">
                                {{ form.featuredImage ? '更换图片' : '上传特色图片' }}
                            </NButton>
                        </NUpload>

                        <div style="font-size: 12px; color: #999;">
                            建议尺寸：800x400px，支持 JPG、PNG 格式
                        </div>
                    </div>
                </NCard>

                <!-- SEO设置 -->
                <NCard title="SEO设置" size="small">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <NFormItem label="SEO标题">
                            <NInput v-model:value="form.metaTitle" placeholder="SEO标题（可选，默认使用文章标题）" :maxlength="60"
                                show-count clearable />
                        </NFormItem>

                        <NFormItem label="SEO描述">
                            <NInput v-model:value="form.metaDescription" type="textarea"
                                placeholder="SEO描述（可选，默认使用文章摘要）" :maxlength="160" show-count :rows="3" clearable />
                        </NFormItem>

                        <NFormItem label="关键词">
                            <NInput v-model:value="form.metaKeywords" placeholder="关键词，用逗号分隔" clearable />
                        </NFormItem>
                    </div>
                </NCard>

                <!-- 文章统计 -->
                <NCard title="文章信息" size="small">
                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">字符数：</span>
                            <span>{{ contentStats.characters }}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">字数：</span>
                            <span>{{ contentStats.words }}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">预计阅读：</span>
                            <span>{{ contentStats.readTime }} 分钟</span>
                        </div>
                    </div>
                </NCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    NCard,
    NButton,
    NInput,
    NSelect,
    NSwitch,
    NFormItem,
    NUpload,
    useMessage,
    useDialog,
    type UploadCustomRequestOptions
} from 'naive-ui'
import { createPost, type CreatePostData } from '@/api/posts'
import { getCategories } from '@/api/categories'
import { getTags } from '@/api/tags'
import { uploadImage } from '@/api/upload'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 表单数据
const form = reactive<CreatePostData & { status: string }>({
    title: '',
    content: '',
    excerpt: '',
    categoryId: undefined,
    tagIds: [],
    status: 'draft',
    featuredImage: '',
    isTop: false,
    allowComments: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
})

// 加载状态
const saving = ref(false)
const publishing = ref(false)
const uploadingFeaturedImage = ref(false)

// 选项数据
const categoryOptions = ref<Array<{ label: string; value: number }>>([])
const tagOptions = ref<Array<{ label: string; value: number }>>([])

// 状态选项
const statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' }
]

// 内容统计
const contentStats = computed(() => {
    const content = form.content || ''
    const characters = content.length
    const words = content.replace(/\s+/g, '').length
    const readTime = Math.ceil(words / 200) // 假设每分钟阅读200字

    return {
        characters,
        words,
        readTime: readTime || 1
    }
})

// 获取分类列表
const fetchCategories = async () => {
    try {
        const response = await getCategories({ limit: 100 })
        categoryOptions.value = response.data.map(cat => ({
            label: cat.name,
            value: cat.id
        }))
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// 获取标签列表
const fetchTags = async () => {
    try {
        const response = await getTags({ limit: 100 })
        tagOptions.value = response.data.map(tag => ({
            label: tag.name,
            value: tag.id
        }))
    } catch (error) {
        console.error('Failed to fetch tags:', error)
    }
}

// 处理图片上传（编辑器内）
const handleUploadImage = async (event: Event, insertImage: Function, files: File[]) => {
    try {
        const file = files[0]
        if (!file) return

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            message.error('请选择图片文件')
            return
        }

        // 验证文件大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
            message.error('图片大小不能超过 5MB')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await uploadImage(formData)

        insertImage({
            url: response.url,
            desc: response.originalName || '图片'
        })

        message.success('图片上传成功')
    } catch (error) {
        console.error('Image upload failed:', error)
        message.error('图片上传失败')
    }
}

// 处理特色图片上传
const handleFeaturedImageUpload = async ({ file }: UploadCustomRequestOptions) => {
    try {
        uploadingFeaturedImage.value = true

        // 验证文件类型
        if (!file.type?.startsWith('image/')) {
            message.error('请选择图片文件')
            return
        }

        // 验证文件大小（5MB）
        if (file.file && file.file.size > 5 * 1024 * 1024) {
            message.error('图片大小不能超过 5MB')
            return
        }

        const formData = new FormData()
        formData.append('file', file.file as File)

        const response = await uploadImage(formData)
        form.featuredImage = response.url

        message.success('特色图片上传成功')
    } catch (error) {
        console.error('Featured image upload failed:', error)
        message.error('特色图片上传失败')
    } finally {
        uploadingFeaturedImage.value = false
    }
}

// 保存文章
const savePost = async (status: 'draft' | 'published') => {
    // 验证必填字段
    if (!form.title.trim()) {
        message.error('请输入文章标题')
        return false
    }

    if (!form.content.trim()) {
        message.error('请输入文章内容')
        return false
    }

    try {
        const postData: CreatePostData = {
            title: form.title.trim(),
            content: form.content,
            excerpt: form.excerpt?.trim() || undefined,
            categoryId: form.categoryId,
            tagIds: form.tagIds,
            status,
            featuredImage: form.featuredImage || undefined,
            isTop: form.isTop,
            allowComments: form.allowComments,
            metaTitle: form.metaTitle?.trim() || undefined,
            metaDescription: form.metaDescription?.trim() || undefined,
            metaKeywords: form.metaKeywords?.trim() || undefined
        }

        await createPost(postData)
        return true
    } catch (error) {
        console.error('Failed to save post:', error)
        throw error
    }
}

// 保存草稿
const handleSaveDraft = async () => {
    try {
        saving.value = true
        const success = await savePost('draft')

        if (success) {
            message.success('草稿保存成功')
            router.push('/posts')
        }
    } catch (error) {
        message.error('保存草稿失败')
    } finally {
        saving.value = false
    }
}

// 发布文章
const handlePublish = async () => {
    try {
        publishing.value = true
        const success = await savePost('published')

        if (success) {
            message.success('文章发布成功')
            router.push('/posts')
        }
    } catch (error) {
        message.error('发布文章失败')
    } finally {
        publishing.value = false
    }
}

// 快捷保存（Ctrl+S）
const handleSave = () => {
    if (form.status === 'published') {
        handlePublish()
    } else {
        handleSaveDraft()
    }
}

// 页面离开确认
const beforeUnload = (e: BeforeUnloadEvent) => {
    if (form.title || form.content) {
        e.preventDefault()
        e.returnValue = ''
    }
}

// 组件挂载
onMounted(() => {
    fetchCategories()
    fetchTags()

    // 添加页面离开确认
    window.addEventListener('beforeunload', beforeUnload)
})

// 组件卸载时清理
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnload)
})
</script>

<style scoped>
/* 自定义样式 */
:deep(.n-card .n-card__content) {
    padding: 16px;
}

:deep(.n-form-item .n-form-item__label) {
    font-weight: 500;
}

/* Markdown 编辑器样式调整 */
:deep(.v-md-editor) {
    border-radius: 6px;
}

:deep(.v-md-editor__toolbar) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

:deep(.v-md-editor__editor-wrapper) {
    border-bottom-left-radius: 6px;
}

:deep(.v-md-editor__preview-wrapper) {
    border-bottom-right-radius: 6px;
}
</style>