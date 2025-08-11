<template>
    <div class="comments-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <n-space justify="space-between" align="center">
                <div>
                    <h1>评论管理</h1>
                    <p>管理用户评论，审核和维护评论内容</p>
                </div>
                <n-space>
                    <n-button type="success" :disabled="selectedComments.length === 0" @click="batchApprove">
                        批量通过
                    </n-button>
                    <n-button type="warning" :disabled="selectedComments.length === 0" @click="batchReject">
                        批量拒绝
                    </n-button>
                    <n-button type="error" :disabled="selectedComments.length === 0" @click="batchDelete">
                        批量删除
                    </n-button>
                </n-space>
            </n-space>
        </div>

        <!-- 搜索筛选 -->
        <n-card class="search-card">
            <n-space>
                <n-select v-model:value="searchParams.status" placeholder="选择状态" clearable style="width: 120px"
                    @update:value="handleSearch" :options="statusOptions" />

                <n-date-picker v-model:value="dateRange" type="daterange" placeholder="选择日期范围" clearable
                    @update:value="handleDateChange" />

                <n-button @click="resetSearch">重置</n-button>
            </n-space>
        </n-card>

        <!-- 评论表格 -->
        <n-card>
            <n-data-table :columns="columns" :data="comments" :loading="loading" :pagination="pagination"
                :row-key="(row: Comment) => row.id" :checked-row-keys="selectedComments"
                @update:checked-row-keys="handleSelectionChange" @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange" />
        </n-card>

        <!-- 编辑评论模态框 -->
        <n-modal v-model:show="showEditModal" preset="dialog" title="编辑评论">
            <template #default>
                <CommentForm :comment="editingComment" @success="handleEditSuccess" @cancel="showEditModal = false" />
            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import {
    NCard, NSpace, NButton, NIcon, NSelect, NDatePicker, NDataTable,
    NModal, NTag, NPopconfirm, NAvatar, useMessage, type DataTableColumns
} from 'naive-ui'
import { Create, Trash, CheckmarkCircle, CloseCircle } from '@vicons/ionicons5'
import {
    getAdminComments, deleteComment, approveComment, rejectComment,
    batchCommentAction, type Comment, type AdminCommentsParams
} from '@/api/comments'
import CommentForm from '@/components/CommentForm.vue'

const message = useMessage()

// 响应式数据
const comments = ref<Comment[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const editingComment = ref<Comment | null>(null)
const selectedComments = ref<number[]>([])
const dateRange = ref<[number, number] | null>(null)

// 搜索参数
const searchParams = reactive<AdminCommentsParams>({
    page: 1,
    limit: 20,
    status: undefined,
    startDate: undefined,
    endDate: undefined
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
    { label: '待审核', value: 'pending' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' }
]

// 表格列配置
const columns: DataTableColumns<Comment> = [
    {
        type: 'selection'
    },
    {
        title: 'ID',
        key: 'id',
        width: 80
    },
    {
        title: '作者',
        key: 'author',
        width: 150,
        render: (row) => {
            return h(NSpace, { align: 'center', size: 'small' }, {
                default: () => [
                    h(NAvatar, {
                        size: 'small',
                        src: row.author.avatar,
                        fallbackSrc: '/default-avatar.png'
                    }),
                    h('div', [
                        h('div', { style: 'font-weight: 500;' }, row.author.nickname || row.author.username),
                        h('div', { style: 'font-size: 12px; color: #666;' }, `@${row.author.username}`)
                    ])
                ]
            })
        }
    },
    {
        title: '评论内容',
        key: 'content',
        width: 300,
        render: (row) => {
            const content = row.content.length > 100 ? row.content.substring(0, 100) + '...' : row.content
            return h('div', { style: 'line-height: 1.4;' }, content)
        }
    },
    {
        title: '文章',
        key: 'post',
        width: 200,
        render: (row) => {
            return h('div', [
                h('div', { style: 'font-weight: 500; margin-bottom: 4px;' }, row.post.title),
                h('code', { style: 'font-size: 12px; background: #f5f5f5; padding: 2px 4px; border-radius: 2px;' }, row.post.slug)
            ])
        }
    },
    {
        title: '状态',
        key: 'status',
        width: 100,
        render: (row) => {
            const statusMap = {
                pending: { type: 'warning', text: '待审核' },
                approved: { type: 'success', text: '已通过' },
                rejected: { type: 'error', text: '已拒绝' }
            }
            const config = statusMap[row.status]
            return h(NTag, { type: config.type as any }, { default: () => config.text })
        }
    },
    {
        title: '点赞数',
        key: 'likeCount',
        width: 80
    },
    {
        title: '回复数',
        key: 'replyCount',
        width: 80
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
                        ghost: true,
                        onClick: () => editComment(row)
                    }, {
                        default: () => '编辑',
                        icon: () => h(NIcon, null, { default: () => h(Create) })
                    }),
                    ...(row.status === 'pending' ? [
                        h(NButton, {
                            size: 'small',
                            type: 'success',
                            ghost: true,
                            onClick: () => handleApproveComment(row)
                        }, {
                            default: () => '通过',
                            icon: () => h(NIcon, null, { default: () => h(CheckmarkCircle) })
                        }),
                        h(NButton, {
                            size: 'small',
                            type: 'warning',
                            ghost: true,
                            onClick: () => handleRejectComment(row)
                        }, {
                            default: () => '拒绝',
                            icon: () => h(NIcon, null, { default: () => h(CloseCircle) })
                        })
                    ] : []),
                    h(NPopconfirm, {
                        onPositiveClick: () => handleDeleteComment(row)
                    }, {
                        default: () => `确定要删除这条评论吗？`,
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

// 获取评论列表
const fetchComments = async () => {
    try {
        loading.value = true
        const response = await getAdminComments(searchParams)

        if (response.success && response.data) {
            comments.value = response.data.data || []
            pagination.itemCount = response.data.total || 0
            pagination.page = response.data.page || 1
        } else {
            console.error('API response format error:', response)
            comments.value = []
            pagination.itemCount = 0
        }
    } catch (error) {
        message.error('获取评论列表失败')
        console.error('Failed to fetch comments:', error)
        comments.value = []
        pagination.itemCount = 0
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    searchParams.page = 1
    pagination.page = 1
    fetchComments()
}

// 日期范围变化
const handleDateChange = (value: [number, number] | null) => {
    if (value) {
        searchParams.startDate = new Date(value[0]).toISOString().split('T')[0]
        searchParams.endDate = new Date(value[1]).toISOString().split('T')[0]
    } else {
        searchParams.startDate = undefined
        searchParams.endDate = undefined
    }
    handleSearch()
}

// 重置搜索
const resetSearch = () => {
    searchParams.status = undefined
    searchParams.startDate = undefined
    searchParams.endDate = undefined
    searchParams.page = 1
    dateRange.value = null
    pagination.page = 1
    fetchComments()
}

// 分页处理
const handlePageChange = (page: number) => {
    searchParams.page = page
    pagination.page = page
    fetchComments()
}

const handlePageSizeChange = (pageSize: number) => {
    searchParams.limit = pageSize
    searchParams.page = 1
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchComments()
}

// 选择处理
const handleSelectionChange = (keys: number[]) => {
    selectedComments.value = keys
}

// 编辑评论
const editComment = (comment: Comment) => {
    editingComment.value = { ...comment }
    showEditModal.value = true
}

// 审核通过评论
const handleApproveComment = async (comment: Comment) => {
    try {
        await approveComment(comment.id)
        message.success('评论已通过')
        await fetchComments()
    } catch (error) {
        message.error('操作失败')
        console.error('Failed to approve comment:', error)
    }
}

// 拒绝评论
const handleRejectComment = async (comment: Comment) => {
    try {
        await rejectComment(comment.id)
        message.success('评论已拒绝')
        await fetchComments()
    } catch (error) {
        message.error('操作失败')
        console.error('Failed to reject comment:', error)
    }
}

// 删除评论
const handleDeleteComment = async (comment: Comment) => {
    try {
        await deleteComment(comment.id)
        message.success('评论已删除')
        await fetchComments()
    } catch (error) {
        message.error('删除失败')
        console.error('Failed to delete comment:', error)
    }
}

// 批量通过
const batchApprove = async () => {
    try {
        await batchCommentAction({
            action: 'approve',
            commentIds: selectedComments.value,
            reason: '批量审核通过'
        })
        message.success(`已通过 ${selectedComments.value.length} 条评论`)
        selectedComments.value = []
        await fetchComments()
    } catch (error) {
        message.error('批量操作失败')
        console.error('Failed to batch approve comments:', error)
    }
}

// 批量拒绝
const batchReject = async () => {
    try {
        await batchCommentAction({
            action: 'reject',
            commentIds: selectedComments.value,
            reason: '批量审核拒绝'
        })
        message.success(`已拒绝 ${selectedComments.value.length} 条评论`)
        selectedComments.value = []
        await fetchComments()
    } catch (error) {
        message.error('批量操作失败')
        console.error('Failed to batch reject comments:', error)
    }
}

// 批量删除
const batchDelete = async () => {
    try {
        await batchCommentAction({
            action: 'delete',
            commentIds: selectedComments.value,
            reason: '批量删除'
        })
        message.success(`已删除 ${selectedComments.value.length} 条评论`)
        selectedComments.value = []
        await fetchComments()
    } catch (error) {
        message.error('批量操作失败')
        console.error('Failed to batch delete comments:', error)
    }
}

// 处理编辑成功
const handleEditSuccess = () => {
    showEditModal.value = false
    editingComment.value = null
    message.success('评论更新成功')
    fetchComments()
}

// 初始化
onMounted(() => {
    fetchComments()
})
</script>

<style scoped>
.comments-view {
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