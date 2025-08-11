<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">{{ title }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ formattedValue }}</p>
                <div v-if="trend !== undefined" class="flex items-center mt-2">
                    <span class="text-sm text-gray-500">{{ trendLabel }}:</span>
                    <span class="ml-1 text-sm font-medium" :class="trendColor">
                        {{ trend }}
                    </span>
                </div>
            </div>
            <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" :class="iconBgColor">
                    {{ icon }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    title: string
    value: number
    icon: string
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
    trend?: number
    trendLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue'
})

// 格式化数值
const formattedValue = computed(() => {
    if (props.value >= 1000000) {
        return (props.value / 1000000).toFixed(1) + 'M'
    }
    if (props.value >= 1000) {
        return (props.value / 1000).toFixed(1) + 'K'
    }
    return props.value.toString()
})

// 图标背景颜色
const iconBgColor = computed(() => {
    const colors = {
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        purple: 'bg-purple-100',
        orange: 'bg-orange-100',
        red: 'bg-red-100'
    }
    return colors[props.color]
})

// 趋势颜色
const trendColor = computed(() => {
    if (props.trend === undefined) return ''
    return props.trend >= 0 ? 'text-green-600' : 'text-red-600'
})
</script>