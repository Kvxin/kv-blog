<template>
    <div class="users-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <n-space justify="space-between" align="center">
                <div>
                    <h1>用户管理</h1>
                    <p>管理系统用户，包括管理员和普通用户</p>
                </div>
                <n-button type="primary" @click="showCreateModal = true">
                    <template #icon>
                        <n-icon>
                            <PersonAdd />
                        </n-icon>
                    </template>
                    新增用户
                </n-button>
            </n-space>
        </div>

        <!-- 搜索筛选 -->
        <n-card class="search-card">
            <n-space>
                <n-input v-model:value="searchParams.keyword" placeholder="搜索用户名、邮箱、昵称" clearable style="width: 300px"
                    @input="handleSearch">
                    <template #prefix>
                        <n-icon>
                            <Search />
                        </n-icon>
                    </template>
                </n-input>

                <n-select v-model:value="searchParams.role" placeholder="选择角色" clearable style="width: 120px"
                    @update:value="handleSearch" :options="roleOptions" />

                <n-select v-model:value="searchParams.status" placeholder="选择状态" clearable style="width: 120px"
                    @update:value="handleSearch" :options="statusOptions" />

                <n-button @click="resetSearch">重置</n-button>
            </n-space>
        </n-card>

        <!-- 用户表格 -->
        <n-card>
            <n-data-table :columns="columns" :data="users" :loading="loading" :pagination="pagination"
                :row-key="(row: User) => row.id" @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange" />
        </n-card>

        <!-- 创建/编辑用户模态框 -->
        <n-modal v-model:show="showCreateModal" preset="dialog" title="新增用户">
            <template #default>
                <UserForm :user="null" @success="handleCreateSuccess" @cancel="showCreateModal = false" />
            </template>
        </n-modal>

        <n-modal v-model:show="showEditModal" preset="dialog" title="编辑用户">
            <template #default>
                <UserForm :user="editingUser" @success="handleEditSuccess" @cancel="showEditModal = false" />
            </template>
        </n-modal>

        <!-- 修改密码模态框 -->
        <n-modal v-model:show="showPasswordModal" preset="dialog" title="修改密码">
            <template #default>
                <PasswordForm :user-id="editingUser?.id" @success="handlePasswordSuccess"
                    @cancel="showPasswordModal = false" />
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
import { PersonAdd, Search, Create, Key, Ban, CheckmarkCircle, Trash } from '@vicons/ionicons5'
import { getUsers, deleteUser, banUser, unbanUser, type User, type UsersParams } from '@/api/users'
import UserForm from '@/components/UserForm.vue'
import PasswordForm from '@/components/PasswordForm.vue'

const message = useMessage()

// 响应式数据
const users = ref<User[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editingUser = ref<User | null>(null)

// 搜索参数
const searchParams = reactive<UsersParams>({
    page: 1,
    limit: 20,
    keyword: '',
    role: undefined,
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
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
const roleOptions = [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' }
]

const statusOptions = [
    { label: '正常', value: 'active' },
    { label: '未激活', value: 'inactive' },
    { label: '已封禁', value: 'banned' }
]

// 表格列配置
const columns: DataTableColumns<User> = [
    {
        title: 'ID',
        key: 'id',
        width: 80
    },
    {
        title: '用户名',
        key: 'username',
        width: 120
    },
    {
        title: '邮箱',
        key: 'email',
        width: 200
    },
    {
        title: '昵称',
        key: 'nickname',
        width: 120,
        render: (row) => row.nickname || '-'
    },
    {
        title: '角色',
        key: 'role',
        width: 100,
        render: (row) => {
            const type = row.role === 'admin' ? 'success' : 'info'
            const text = row.role === 'admin' ? '管理员' : '普通用户'
            return h(NTag, { type }, { default: () => text })
        }
    },
    {
        title: '状态',
        key: 'status',
        width: 100,
        render: (row) => {
            const statusMap = {
                active: { type: 'success', text: '正常' },
                inactive: { type: 'warning', text: '未激活' },
                banned: { type: 'error', text: '已封禁' }
            }
            const config = statusMap[row.status] || { type: 'default', text: row.status }
            return h(NTag, { type: config.type as any }, { default: () => config.text })
        }
    },
    {
        title: '注册时间',
        key: 'createdAt',
        width: 180,
        render: (row) => new Date(row.createdAt).toLocaleString('zh-CN')
    },
    {
        title: '最后登录',
        key: 'lastLoginAt',
        width: 180,
        render: (row) => row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString('zh-CN') : '-'
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
                        onClick: () => editUser(row)
                    }, {
                        default: () => '编辑',
                        icon: () => h(NIcon, null, { default: () => h(Create) })
                    }),
                    h(NButton, {
                        size: 'small',
                        type: 'warning',
                        ghost: true,
                        onClick: () => changePassword(row)
                    }, {
                        default: () => '改密',
                        icon: () => h(NIcon, null, { default: () => h(Key) })
                    }),
                    h(NButton, {
                        size: 'small',
                        type: row.status === 'banned' ? 'success' : 'warning',
                        ghost: true,
                        onClick: () => toggleUserStatus(row)
                    }, {
                        default: () => row.status === 'banned' ? '解封' : '封禁',
                        icon: () => h(NIcon, null, {
                            default: () => row.status === 'banned' ? h(CheckmarkCircle) : h(Ban)
                        })
                    }),
                    h(NPopconfirm, {
                        onPositiveClick: () => handleDeleteUser(row)
                    }, {
                        default: () => `确定要删除用户 ${row.username} 吗？`,
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

// 获取用户列表
const fetchUsers = async () => {
    try {
        loading.value = true
        const response = await getUsers(searchParams)

        if (response.success && response.data) {
            users.value = response.data.data || []
            pagination.itemCount = response.data.total || 0
            pagination.page = response.data.page || 1
        } else {
            console.error('API response format error:', response)
            users.value = []
            pagination.itemCount = 0
        }
    } catch (error) {
        message.error('获取用户列表失败')
        console.error('Failed to fetch users:', error)
        users.value = []
        pagination.itemCount = 0
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    searchParams.page = 1
    pagination.page = 1
    fetchUsers()
}

// 重置搜索
const resetSearch = () => {
    searchParams.keyword = ''
    searchParams.role = undefined
    searchParams.status = undefined
    searchParams.page = 1
    pagination.page = 1
    fetchUsers()
}

// 分页处理
const handlePageChange = (page: number) => {
    searchParams.page = page
    pagination.page = page
    fetchUsers()
}

const handlePageSizeChange = (pageSize: number) => {
    searchParams.limit = pageSize
    searchParams.page = 1
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchUsers()
}

// 编辑用户
const editUser = (user: User) => {
    editingUser.value = { ...user }
    showEditModal.value = true
}

// 修改密码
const changePassword = (user: User) => {
    editingUser.value = user
    showPasswordModal.value = true
}

// 切换用户状态
const toggleUserStatus = async (user: User) => {
    try {
        if (user.status === 'banned') {
            await unbanUser(user.id)
            message.success('用户已解封')
        } else {
            await banUser(user.id)
            message.success('用户已封禁')
        }
        await fetchUsers()
    } catch (error) {
        message.error('操作失败')
        console.error('Failed to toggle user status:', error)
    }
}

// 删除用户
const handleDeleteUser = async (user: User) => {
    try {
        await deleteUser(user.id)
        message.success('用户已删除')
        await fetchUsers()
    } catch (error) {
        message.error('删除失败')
        console.error('Failed to delete user:', error)
    }
}

// 处理创建成功
const handleCreateSuccess = () => {
    showCreateModal.value = false
    message.success('用户创建成功')
    fetchUsers()
}

// 处理编辑成功
const handleEditSuccess = () => {
    showEditModal.value = false
    editingUser.value = null
    message.success('用户更新成功')
    fetchUsers()
}

// 处理密码修改成功
const handlePasswordSuccess = () => {
    showPasswordModal.value = false
    editingUser.value = null
    message.success('密码修改成功')
}

// 初始化
onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
.users-view {
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