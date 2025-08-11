import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getProfile, type LoginParams, type UserProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
    // 状态
    const user = ref<UserProfile | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))

    // 计算属性
    const isLoggedIn = computed(() => !!token.value && !!user.value)
    const isAuthenticated = computed(() => isLoggedIn.value) // 别名，保持兼容性
    const isAdmin = computed(() => user.value?.role === 'admin')

    // 登录
    const login = async (params: LoginParams) => {
        try {
            const response = await loginApi(params)

            // 保存token和用户信息
            token.value = response.token
            user.value = response.user

            // 持久化存储
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            return response
        } catch (error) {
            throw error
        }
    }

    // 获取用户信息
    const fetchProfile = async () => {
        try {
            const profile = await getProfile()
            user.value = profile
            localStorage.setItem('user', JSON.stringify(profile))
            return profile
        } catch (error) {
            // 如果获取用户信息失败，清除本地存储
            logout()
            throw error
        }
    }

    // 登出
    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    // 初始化用户信息
    const initUser = () => {
        const storedUser = localStorage.getItem('user')
        if (storedUser && token.value) {
            try {
                user.value = JSON.parse(storedUser)
            } catch (error) {
                console.error('Failed to parse stored user data:', error)
                logout()
            }
        }
    }

    return {
        user,
        token,
        isLoggedIn,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        fetchProfile,
        initUser
    }
})