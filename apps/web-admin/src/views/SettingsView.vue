<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">系统设置</h1>
        <p class="text-gray-600">配置系统参数和功能选项</p>
      </div>
    </div>

    <!-- 系统配置表单 -->
    <NCard title="基本设置">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        :disabled="loading"
      >
        <NFormItem label="网站标题" path="siteTitle">
          <NInput v-model:value="formData.siteTitle" placeholder="请输入网站标题" />
        </NFormItem>

        <NFormItem label="网站描述" path="siteDescription">
          <NInput
            v-model:value="formData.siteDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入网站描述"
          />
        </NFormItem>

        <NFormItem label="网站关键词" path="siteKeywords">
          <NInput v-model:value="formData.siteKeywords" placeholder="请输入网站关键词，用逗号分隔" />
        </NFormItem>

        <NFormItem label="允许用户注册">
          <NSwitch v-model:value="formData.allowRegistration" />
        </NFormItem>

        <NFormItem label="评论需要审核">
          <NSwitch v-model:value="formData.requireCommentApproval" />
        </NFormItem>

        <NFormItem label="每页文章数量" path="postsPerPage">
          <NInputNumber
            v-model:value="formData.postsPerPage"
            :min="1"
            :max="100"
            placeholder="每页显示的文章数量"
          />
        </NFormItem>

        <NFormItem label="文件上传限制" path="maxFileSize">
          <div class="flex items-center space-x-2">
            <NInputNumber
              v-model:value="fileSizeMB"
              :min="1"
              :max="100"
              placeholder="文件大小限制"
            />
            <span class="text-gray-500">MB</span>
          </div>
        </NFormItem>

        <NFormItem>
          <div class="flex space-x-3">
            <NButton type="primary" :loading="loading" @click="handleSave">
              保存设置
            </NButton>
            <NButton @click="handleReset">重置</NButton>
          </div>
        </NFormItem>
      </NForm>
    </NCard>

    <!-- 系统操作 -->
    <NCard title="系统操作">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NButton
          type="info"
          size="large"
          :loading="healthLoading"
          @click="checkSystemHealth"
          class="h-16"
        >
          <div class="text-center">
            <div class="text-lg">🏥</div>
            <div>系统健康检查</div>
          </div>
        </NButton>

        <NButton
          type="warning"
          size="large"
          :loading="backupLoading"
          @click="createBackup"
          class="h-16"
        >
          <div class="text-center">
            <div class="text-lg">💾</div>
            <div>创建备份</div>
          </div>
        </NButton>

        <NButton
          type="error"
          size="large"
          :loading="cacheLoading"
          @click="clearCache"
          class="h-16"
        >
          <div class="text-center">
            <div class="text-lg">🗑️</div>
            <div>清理缓存</div>
          </div>
        </NButton>

        <NButton
          type="success"
          size="large"
          :loading="reindexLoading"
          @click="rebuildIndex"
          class="h-16"
        >
          <div class="text-center">
            <div class="text-lg">🔍</div>
            <div>重建索引</div>
          </div>
        </NButton>
      </div>
    </NCard>

    <!-- 系统信息 -->
    <NCard title="系统信息" v-if="systemHealth">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-500">系统版本</div>
          <div class="text-lg font-semibold">{{ systemHealth.version || 'N/A' }}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-500">运行时间</div>
          <div class="text-lg font-semibold">{{ formatUptime(systemHealth.uptime) }}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-500">运行环境</div>
          <div class="text-lg font-semibold">{{ systemHealth.environment || 'N/A' }}</div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSwitch,
  NButton,
  useMessage,
  useDialog,
  type FormInst
} from 'naive-ui'
import {
  getSystemConfig,
  updateSystemConfig,
  getSystemHealth,
  createSystemBackup,
  clearSystemCache,
  rebuildSearchIndex,
  type SystemConfig,
  type SystemHealth
} from '@/api/settings'

const message = useMessage()
const dialog = useDialog()
const formRef = ref<FormInst>()

// 表单数据
const formData = reactive<SystemConfig>({
  siteTitle: '',
  siteDescription: '',
  siteKeywords: '',
  allowRegistration: true,
  requireCommentApproval: true,
  postsPerPage: 10,
  maxFileSize: 5242880
})

// 原始数据备份
const originalData = ref<SystemConfig>()

// 加载状态
const loading = ref(false)
const healthLoading = ref(false)
const backupLoading = ref(false)
const cacheLoading = ref(false)
const reindexLoading = ref(false)

// 系统健康状态
const systemHealth = ref<SystemHealth>()

// 文件大小（MB）
const fileSizeMB = computed({
  get: () => Math.round(formData.maxFileSize / 1024 / 1024),
  set: (value: number) => {
    formData.maxFileSize = value * 1024 * 1024
  }
})

// 表单验证规则
const rules = {
  siteTitle: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ],
  postsPerPage: [
    { required: true, message: '请输入每页文章数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '每页文章数量必须在1-100之间', trigger: 'blur' }
  ]
}

// 加载系统配置
const loadSystemConfig = async () => {
  try {
    const config = await getSystemConfig()
    Object.assign(formData, config)
    originalData.value = { ...config }
  } catch (error) {
    message.error('加载系统配置失败')
  }
}

// 保存设置
const handleSave = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await updateSystemConfig(formData)
    originalData.value = { ...formData }
    message.success('系统设置保存成功')
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message)
    } else {
      message.error('保存失败')
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value)
    message.info('已重置为原始设置')
  }
}

// 检查系统健康状态
const checkSystemHealth = async () => {
  try {
    healthLoading.value = true
    systemHealth.value = await getSystemHealth()
    message.success('系统健康检查完成')
  } catch (error) {
    message.error('系统健康检查失败')
  } finally {
    healthLoading.value = false
  }
}

// 创建备份
const createBackup = async () => {
  dialog.warning({
    title: '创建系统备份',
    content: '确定要创建系统备份吗？这可能需要一些时间。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        backupLoading.value = true
        await createSystemBackup()
        message.success('系统备份创建成功')
      } catch (error) {
        message.error('创建备份失败')
      } finally {
        backupLoading.value = false
      }
    }
  })
}

// 清理缓存
const clearCache = async () => {
  dialog.warning({
    title: '清理系统缓存',
    content: '确定要清理系统缓存吗？这将清除所有缓存数据。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        cacheLoading.value = true
        await clearSystemCache()
        message.success('系统缓存清理成功')
      } catch (error) {
        message.error('清理缓存失败')
      } finally {
        cacheLoading.value = false
      }
    }
  })
}

// 重建搜索索引
const rebuildIndex = async () => {
  dialog.warning({
    title: '重建搜索索引',
    content: '确定要重建搜索索引吗？这可能需要一些时间。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        reindexLoading.value = true
        await rebuildSearchIndex()
        message.success('搜索索引重建成功')
      } catch (error) {
        message.error('重建索引失败')
      } finally {
        reindexLoading.value = false
      }
    }
  })
}

// 格式化运行时间
const formatUptime = (seconds: number): string => {
  if (!seconds) return 'N/A'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}天 ${hours}小时 ${minutes}分钟`
  } else if (hours > 0) {
    return `${hours}小时 ${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadSystemConfig()
  checkSystemHealth()
})
</script>