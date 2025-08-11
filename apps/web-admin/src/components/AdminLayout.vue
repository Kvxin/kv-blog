<template>
    <div class="h-screen flex">
        <!-- 侧边栏 -->
        <div class="w-64 bg-white shadow-lg">
            <div class="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 class="text-xl font-bold text-gray-800">KV Blog 管理</h1>
            </div>

            <nav class="mt-8">
                <div class="px-4 space-y-2">
                    <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
                        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                        :class="[
                            $route.path === item.path
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        ]">
                        <component :is="item.icon" class="w-5 h-5 mr-3" />
                        {{ item.title }}
                    </router-link>
                </div>
            </nav>
        </div>

        <!-- 主内容区域 -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- 顶部导航栏 -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="flex items-center justify-between h-16 px-6">
                    <div class="flex items-center">
                        <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
                    </div>

                    <div class="flex items-center space-x-4">
                        <!-- 用户菜单 -->
                        <NDropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                            <div
                                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                                <NAvatar size="small">
                                    {{ (userStore.user?.nickname || userStore.user?.username ||
                                        'A').charAt(0).toUpperCase() }}
                                </NAvatar>
                                <span class="text-sm font-medium text-gray-700">{{ userStore.user?.nickname ||
                                    userStore.user?.username || '用户' }}</span>
                                <NIcon size="16" class="text-gray-400">
                                    <ChevronDownIcon />
                                </NIcon>
                            </div>
                        </NDropdown>
                    </div>
                </div>
            </header>

            <!-- 页面内容 -->
            <main class="flex-1 overflow-auto bg-gray-50 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDropdown, NAvatar, NIcon, useDialog, useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'

// Icons (使用简单的SVG图标或者可以安装图标库)
const DashboardIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' })
])

const PostIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z', 'clip-rule': 'evenodd' })
])

const UserIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', 'clip-rule': 'evenodd' })
])

const CategoryIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' })
])

const TagIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z', 'clip-rule': 'evenodd' })
])

const CommentIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z', 'clip-rule': 'evenodd' })
])

const SettingsIcon = () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', 'clip-rule': 'evenodd' })
])

const ChevronDownIcon = () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z', 'clip-rule': 'evenodd' })
])

const route = useRoute()
const router = useRouter()
const dialog = useDialog()
const message = useMessage()
const userStore = useUserStore()

// 菜单项
const menuItems = [
    { path: '/dashboard', title: '仪表板', icon: DashboardIcon },
    { path: '/posts', title: '文章管理', icon: PostIcon },
    { path: '/users', title: '用户管理', icon: UserIcon },
    { path: '/categories', title: '分类管理', icon: CategoryIcon },
    { path: '/tags', title: '标签管理', icon: TagIcon },
    { path: '/comments', title: '评论管理', icon: CommentIcon },
    { path: '/settings', title: '系统设置', icon: SettingsIcon }
]

// 页面标题映射
const pageTitleMap: Record<string, string> = {
    '/dashboard': '仪表板',
    '/posts': '文章管理',
    '/users': '用户管理',
    '/categories': '分类管理',
    '/tags': '标签管理',
    '/comments': '评论管理',
    '/settings': '系统设置'
}

const pageTitle = computed(() => {
    return pageTitleMap[route.path] || '管理后台'
})

// 用户菜单选项
const userMenuOptions = [
    {
        label: '个人资料',
        key: 'profile'
    },
    {
        label: '修改密码',
        key: 'change-password'
    },
    {
        type: 'divider',
        key: 'd1'
    },
    {
        label: '退出登录',
        key: 'logout'
    }
]

const handleUserMenuSelect = (key: string) => {
    switch (key) {
        case 'profile':
            // 跳转到个人资料页面
            break
        case 'change-password':
            // 打开修改密码对话框
            break
        case 'logout':
            handleLogout()
            break
    }
}

const handleLogout = () => {
    dialog.warning({
        title: '确认退出',
        content: '您确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            userStore.logout()
            message.success('已退出登录')
            router.push('/login')
        }
    })
}
</script>