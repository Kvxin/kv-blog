<template>
    <div class="space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">文章管理</h1>
                <p class="text-gray-600">管理博客文章内容</p>
            </div>
            <NButton type="primary" @click="$router.push('/posts/create')">
                <template #icon>
                    <NIcon>
                        <PlusIcon />
                    </NIcon>
                </template>
                新建文章
            </NButton>
        </div>

        <!-- 搜索和筛选 -->
        <NCard>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 暂时禁用搜索功能，等待后端修复 -->
                <!-- <NInput v-model:value="searchParams.keyword" placeholder="搜索文章标题..." clearable
                    @keyup.enter="handleSearch">
                    <template #prefix>
                        <NIcon>
                            <SearchIcon />
                        </NIcon>
                    </template>
                </NInput> -->

                <NSelect v-model:value="searchParams.status" placeholder="文章状态" clearable :options="statusOptions" />

                <!-- 暂时禁用排序功能，等待后端修复 -->
                <!-- <NSelect v-model:value="searchParams.sortBy" placeholder="排序方式" :options="sortOptions" /> -->

                <div class="flex space-x-2">
                    <NButton type="primary" @click="handleSearch">刷新</NButton>
                    <NButton @click="handleReset">重置</NButton>
                </div>
            </div>

            <!-- 提示信息 -->
            <div
                style="margin-top: 16px; padding: 12px; background-color: #fff7e6; border: 1px solid #ffd591; border-radius: 6px; color: #d46b08;">
                <strong>注意：</strong> 搜索和排序功能暂时不可用，后端API需要修复以支持 keyword、sortBy、sortOrder 参数。
            </div>
        </NCard>

        <!-- 批量操作 -->
        <div v-if="selectedRowKeys.length > 0" class="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
            <span class="text-sm text-blue-700">已选择 {{ selectedRowKeys.length }} 项</span>
            <NButton size="small" type="warning" @click="handleBatchAction('publish')">
                批量发布
            </NButton>
            <NButton size="small" type="default" @click="handleBatchAction('archive')">
                批量归档
            </NButton>
            <NButton size="small" type="error" @click="handleBatchAction('delete')">
                批量删除
            </NButton>
        </div>

        <!-- 文章列表 -->
        <NCard>
            <NDataTable :columns="columns" :data="posts" :loading="loading" :pagination="pagination"
                :row-key="(row: Post) => row.id" v-model:checked-row-keys="selectedRowKeys"
                @update:page="handlePageChange" @update:page-size="handlePageSizeChange" />
        </NCard>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import {
    NCard,
    NButton,
    NInput,
    NSelect,
    NDataTable,
    NIcon,
    NTag,
    NSpace,
    NPopconfirm,
    useMessage,
    useDialog,
    type DataTableColumns
} from 'naive-ui'
import { getPosts, deletePost, batchPostAction, type Post, type PostsParams } from '@/api/posts'

// Icons
const PlusIcon = () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z', 'clip-rule': 'evenodd' })
])

const SearchIcon = () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z', 'clip-rule': 'evenodd' })
])

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 响应式数据
const posts = ref<Post[]>([])
const loading = ref(false)
const selectedRowKeys = ref<number[]>([])

// 搜索参数
const searchParams = reactive<PostsParams>({
    page: 1,
    limit: 20,
    status: undefined
    // 注意：keyword, sortBy, sortOrder 暂时不可用，等待后端修复
})

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100]
})

// 状态选项
const statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已归档', value: 'archived' }
]

// 排序选项
const sortOptions = [
    { label: '创建时间', value: 'createdAt' },
    { label: '更新时间', value: 'updatedAt' },
    { label: '浏览量', value: 'viewCount' }
]

// 表格列配置
const columns: DataTableColumns<Post> = [
    {
        type: 'selection'
    },
    {
        title: '标题',
        key: 'title',
        width: 300,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '作者',
        key: 'author',
        width: 120,
        render: (row) => row.author?.nickname || row.author?.username || '未知'
    },
    {
        title: '分类',
        key: 'category',
        width: 120,
        render: (row) => row.category?.name || '未分类'
    },
    {
        title: '状态',
        key: 'status',
        width: 120,
        render: (row) => {
            const statusMap = {
                draft: { type: 'default', text: '草稿' },
                published: { type: 'success', text: '已发布' },
                archived: { type: 'warning', text: '已归档' }
            }
            const status = statusMap[row.status]
            return h(NSpace, { size: 'small' }, {
                default: () => [
                    h(NTag, { type: status.type as any }, { default: () => status.text }),
                    row.isTop ? h(NTag, { type: 'error', size: 'small' }, { default: () => '置顶' }) : null
                ].filter(Boolean)
            })
        }
    },
    {
        title: '浏览量',
        key: 'viewCount',
        width: 100
    },
    {
        title: '评论数',
        key: 'commentCount',
        width: 100
    },
    {
        title: '创建时间',
        key: 'createdAt',
        width: 180,
        render: (row) => new Date(row.createdAt).toLocaleString('zh-CN')
    },
    {
        title: '操作',
        key: 'actions',
        width: 200,
        render: (row) => {
            return h(NSpace, { size: 'small' }, {
                default: () => [
                    h(NButton, {
                        size: 'small',
                        type: 'primary',
                        onClick: () => router.push(`/posts/${row.id}/edit`)
                    }, { default: () => '编辑' }),
                    h(NPopconfirm, {
                        onPositiveClick: () => handleDelete(row.id)
                    }, {
                        trigger: () => h(NButton, {
                            size: 'small',
                            type: 'error'
                        }, { default: () => '删除' }),
                        default: () => '确定删除这篇文章吗？'
                    })
                ]
            })
        }
    }
]

// 获取文章列表
const fetchPosts = async () => {
    try {
        loading.value = true
        const response = await getPosts(searchParams)

        console.log('Full API response:', response) // 调试日志

        // 处理后端返回的嵌套数据结构
        if (response.success && response.data) {
            posts.value = response.data.data || []
            pagination.itemCount = response.data.total || 0
            pagination.page = response.data.page || 1
        } else {
            console.error('API response format error:', response)
            posts.value = []
            pagination.itemCount = 0
        }

        console.log('Processed posts data:', posts.value) // 调试日志
        console.log('Posts count:', posts.value.length) // 调试日志
    } catch (error) {
        message.error('获取文章列表失败')
        console.error('Failed to fetch posts:', error)
        posts.value = []
        pagination.itemCount = 0
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    searchParams.page = 1
    pagination.page = 1
    fetchPosts()
}

// 重置搜索
const handleReset = () => {
    Object.assign(searchParams, {
        page: 1,
        limit: 20,
        status: undefined
    })
    pagination.page = 1
    fetchPosts()
}

// 分页变化
const handlePageChange = (page: number) => {
    searchParams.page = page
    pagination.page = page
    fetchPosts()
}

const handlePageSizeChange = (pageSize: number) => {
    searchParams.limit = pageSize
    searchParams.page = 1
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchPosts()
}

// 删除文章
const handleDelete = async (id: number) => {
    try {
        await deletePost(id)
        message.success('删除成功')
        fetchPosts()
    } catch (error) {
        message.error('删除失败')
        console.error('Failed to delete post:', error)
    }
}

// 批量操作
const handleBatchAction = (action: 'delete' | 'publish' | 'archive') => {
    const actionMap = {
        delete: '删除',
        publish: '发布',
        archive: '归档'
    }

    dialog.warning({
        title: `确认${actionMap[action]}`,
        content: `您确定要${actionMap[action]}选中的 ${selectedRowKeys.value.length} 篇文章吗？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            try {
                await batchPostAction({
                    action,
                    postIds: selectedRowKeys.value
                })
                message.success(`${actionMap[action]}成功`)
                selectedRowKeys.value = []
                fetchPosts()
            } catch (error) {
                message.error(`${actionMap[action]}失败`)
                console.error(`Failed to ${action} posts:`, error)
            }
        }
    })
}

// 组件挂载时获取数据
onMounted(() => {
    fetchPosts()
})
</script>