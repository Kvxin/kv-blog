<template>
    <div class="tags-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <n-space justify="space-between" align="center">
                <div>
                    <h1>标签管理</h1>
                    <p>管理文章标签，便于内容分类和检索</p>
                </div>
                <n-button type="primary" @click="showCreateModal = true">
                    <template #icon>
                        <n-icon>
                            <Add />
                        </n-icon>
                    </template>
                    新增标签
                </n-button>
            </n-space>
        </div>

        <!-- 搜索筛选 -->
        <n-card class="search-card">
            <n-space>
                <n-input v-model:value="searchParams.keyword" placeholder="搜索标签名称、别名" clearable style="width: 300px"
                    @input="handleSearch">
                    <template #prefix>
                        <n-icon>
                            <Search />
                        </n-icon>
                    </template>
                </n-input>

                <n-select v-model:value="searchParams.isActive" placeholder="选择状态" clearable style="width: 120px"
                    @update:value="handleSearch" :options="statusOptions" />

                <n-button @click="resetSearch">重置</n-button>
            </n-space>
        </n-card>

        <!-- 标签表格 -->
        <n-card>
            <n-data-table :columns="columns" :data="tags" :loading="loading" :pagination="pagination"
                :row-key="(row: Tag) => row.id" @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange" />
        </n-card>

        <!-- 创建/编辑标签模态框 -->
        <n-modal v-model:show="showCreateModal" preset="dialog" title="新增标签">
            <template #default>
                <TagForm :tag="null" @success="handleCreateSuccess" @cancel="showCreateModal = false" />
            </template>
        </n-modal>

        <n-modal v-model:show="showEditModal" preset="dialog" title="编辑标签">
            <template #default>
                <TagForm :tag="editingTag" @success="handleEditSuccess" @cancel="showEditModal = false" />
            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import {
    NCard, NSpace, NButton, NIcon, NInput, NSelect, NDataTable,
    NModal, NTag, NPopconfirm, useMessage, type DataTableColumns
} from 'naive-ui'
import { Add, Search, Create, Trash } from '@vicons/ionicons5'
import { getTags, deleteTag, type Tag, type TagsParams } from '@/api/tags'
import TagForm from '@/components/TagForm.vue'

const message = useMessage()

// 响应式数据
const tags = ref<Tag[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTag = ref<Tag | null>(null)

// 搜索参数
const searchParams = reactive<TagsParams>({
    page: 1,
    limit: 20,
    keyword: '',
    isActive: undefined,
    sortBy: 'name',
    sortOrder: 'ASC'
})

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: true,
    prefix: (info: any) => `共 ${info.itemCount} 条`
})

// 选项配置
const statusOptions = [
    { label: '启用', value: true },
    { label: '禁用', value: false }
]

// 表格列配置
const columns: DataTableColumns<Tag> = [
    {
        title: 'ID',
        key: 'id',
        width: 80
    },
    {
        title: '标签名称',
        key: 'name',
        width: 150,
        render: (row) => {
            return h(NTag, {
                color: { color: row.color || '#f0f0f0', textColor: '#333' },
                size: 'small'
            }, { default: () => row.name })
        }
    },
    {
        title: '别名',
        key: 'slug',
        width: 150,
        render: (row) => h('code', { style: 'background: #f5f5f5; padding: 2px 6px; border-radius: 3px;' }, row.slug)
    },
    {
        title: '描述',
        key: 'description',
        width: 200,
        render: (row) => row.description || '-'
    },
    {
        title: '颜色',
        key: 'color',
        width: 100,
        render: (row) => {
            if (!row.color) return '-'
            return h('div', { style: 'display: flex; align-items: center; gap: 8px;' }, [
                h('div', {
                    style: `width: 20px; height: 20px; background: ${row.color}; border-radius: 3px; border: 1px solid #ddd;`
                }),
                h('span', row.color)
            ])
        }
    },
    {
        title: '状态',
        key: 'isActive',
        width: 100,
        render: (row) => {
            const type = row.isActive ? 'success' : 'error'
            const text = row.isActive ? '启用' : '禁用'
            return h(NTag, { type }, { default: () => text })
        }
    },
    {
        title: '文章数',
        key: 'postCount',
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
        width: 150,
        render: (row) => {
            return h(NSpace, { size: 'small' }, {
                default: () => [
                    h(NButton, {
                        size: 'small',
                        type: 'primary',
                        ghost: true,
                        onClick: () => editTag(row)
                    }, {
                        default: () => '编辑',
                        icon: () => h(NIcon, null, { default: () => h(Create) })
                    }),
                    h(NPopconfirm, {
                        onPositiveClick: () => handleDeleteTag(row)
                    }, {
                        default: () => `确定要删除标签 ${row.name} 吗？`,
                        trigger: () => h(NButton, {
                            size: 'small',
                            type: 'error',
                            ghost: true
                        }, {
                            default: () => '删除',
                            icon: () => h(NIcon, null, { default: () => h(Trash) })
                        })
                    })
                ]
            })
        }
    }
]

// 获取标签列表
const fetchTags = async () => {
    try {
        loading.value = true
        const response = await getTags(searchParams)

        if (response.success && response.data) {
            tags.value = response.data.data || []
            pagination.itemCount = response.data.total || 0
            pagination.page = response.data.page || 1
        } else {
            console.error('API response format error:', response)
            tags.value = []
            pagination.itemCount = 0
        }
    } catch (error) {
        message.error('获取标签列表失败')
        console.error('Failed to fetch tags:', error)
        tags.value = []
        pagination.itemCount = 0
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    searchParams.page = 1
    pagination.page = 1
    fetchTags()
}

// 重置搜索
const resetSearch = () => {
    searchParams.keyword = ''
    searchParams.isActive = undefined
    searchParams.page = 1
    pagination.page = 1
    fetchTags()
}

// 分页处理
const handlePageChange = (page: number) => {
    searchParams.page = page
    pagination.page = page
    fetchTags()
}

const handlePageSizeChange = (pageSize: number) => {
    searchParams.limit = pageSize
    searchParams.page = 1
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchTags()
}

// 编辑标签
const editTag = (tag: Tag) => {
    editingTag.value = { ...tag }
    showEditModal.value = true
}

// 删除标签
const handleDeleteTag = async (tag: Tag) => {
    try {
        await deleteTag(tag.id)
        message.success('标签已删除')
        await fetchTags()
    } catch (error) {
        message.error('删除失败')
        console.error('Failed to delete tag:', error)
    }
}

// 处理创建成功
const handleCreateSuccess = () => {
    showCreateModal.value = false
    message.success('标签创建成功')
    fetchTags()
}

// 处理编辑成功
const handleEditSuccess = () => {
    showEditModal.value = false
    editingTag.value = null
    message.success('标签更新成功')
    fetchTags()
}

// 初始化
onMounted(() => {
    fetchTags()
})
</script>

<style scoped>
.tags-view {
    padding: 20px;
}

.page-header {
    margin-bottom: 20px;
}

.page-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
}

.page-header p {
    margin: 4px 0 0 0;
    color: #666;
}

.search-card {
    margin-bottom: 20px;
}
</style>