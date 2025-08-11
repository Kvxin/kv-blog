<template>
    <div class="space-y-6">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="总文章数" :value="stats?.totalPosts || 0" icon="📝" color="blue"
                :trend="stats?.recentStats.postsThisMonth" trend-label="本月新增" />
            <StatCard title="总用户数" :value="stats?.totalUsers || 0" icon="👥" color="green"
                :trend="stats?.recentStats.usersThisMonth" trend-label="本月新增" />
            <StatCard title="总评论数" :value="stats?.totalComments || 0" icon="💬" color="purple"
                :trend="stats?.recentStats.commentsThisMonth" trend-label="本月新增" />
            <StatCard title="分类数量" :value="stats?.totalCategories || 0" icon="📂" color="orange" />
        </div>

        <!-- 图表和活动日志 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 访问统计图表 -->
            <NCard title="访问统计" class="h-96">
                <div v-if="visitStatsLoading" class="flex items-center justify-center h-64">
                    <NSpin size="large" />
                </div>
                <div v-else class="h-64">
                    <!-- 这里可以集成图表库如 ECharts 或 Chart.js -->
                    <div class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <div class="text-4xl mb-2">📊</div>
                            <p>访问统计图表</p>
                            <p class="text-sm">可集成 ECharts 或其他图表库</p>
                        </div>
                    </div>
                </div>
            </NCard>

            <!-- 最近活动 -->
            <NCard title="最近活动" class="h-96">
                <div v-if="activitiesLoading" class="flex items-center justify-center h-64">
                    <NSpin size="large" />
                </div>
                <div v-else class="space-y-3 h-64 overflow-y-auto">
                    <div v-for="activity in activities" :key="activity.id"
                        class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span class="text-blue-600 text-sm">{{ activity.user.nickname.charAt(0) }}</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-gray-900">
                                <span class="font-medium">{{ activity.user.nickname }}</span>
                                {{ activity.description }}
                            </p>
                            <p class="text-xs text-gray-500">{{ formatTime(activity.createdAt) }}</p>
                        </div>
                    </div>
                </div>
            </NCard>
        </div>

        <!-- 热门文章 -->
        <NCard title="热门文章">
            <div v-if="statsLoading" class="flex items-center justify-center h-32">
                <NSpin size="large" />
            </div>
            <div v-else>
                <NTable :bordered="false" :single-line="false">
                    <thead>
                        <tr>
                            <th>文章标题</th>
                            <th>浏览量</th>
                            <th>点赞数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="post in stats?.popularPosts" :key="post.id">
                            <td>{{ post.title }}</td>
                            <td>{{ post.viewCount }}</td>
                            <td>{{ post.likeCount }}</td>
                        </tr>
                    </tbody>
                </NTable>
            </div>
        </NCard>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NSpin, NTable, useMessage } from 'naive-ui'
import { getDashboardStats, getActivities, getVisitStats, type DashboardStats, type ActivityLog } from '@/api/dashboard'
import StatCard from '@/components/StatCard.vue'

const message = useMessage()

// 响应式数据
const stats = ref<DashboardStats | null>(null)
const activities = ref<ActivityLog[]>([])
const statsLoading = ref(true)
const activitiesLoading = ref(true)
const visitStatsLoading = ref(true)

// 获取仪表板统计数据
const fetchStats = async () => {
    try {
        statsLoading.value = true
        stats.value = await getDashboardStats()
    } catch (error) {
        message.error('获取统计数据失败')
        console.error('Failed to fetch dashboard stats:', error)
    } finally {
        statsLoading.value = false
    }
}

// 获取活动日志
const fetchActivities = async () => {
    try {
        activitiesLoading.value = true
        const response = await getActivities({ page: 1, limit: 10 })
        activities.value = response.data
    } catch (error) {
        message.error('获取活动日志失败')
        console.error('Failed to fetch activities:', error)
    } finally {
        activitiesLoading.value = false
    }
}

// 获取访问统计
const fetchVisitStats = async () => {
    try {
        visitStatsLoading.value = true
        await getVisitStats({ period: 'week' })
        // 这里可以处理图表数据
    } catch (error) {
        message.error('获取访问统计失败')
        console.error('Failed to fetch visit stats:', error)
    } finally {
        visitStatsLoading.value = false
    }
}

// 格式化时间
const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
    fetchStats()
    fetchActivities()
    fetchVisitStats()
})
</script>