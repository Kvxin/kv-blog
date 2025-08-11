# 后台管理系统前端开发指南

## 📋 概述

本指南为KV Blog后台管理系统的前端开发提供详细的API使用说明和最佳实践。

## 🚀 快速开始

### 1. 环境配置
```javascript
// config.js
export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

### 2. HTTP客户端封装
```javascript
// api/client.js
import axios from 'axios';
import { API_CONFIG } from '../config';

const apiClient = axios.create(API_CONFIG);

// 请求拦截器 - 添加Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理响应
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.success) {
      return data.data; // 直接返回数据部分
    } else {
      throw new Error(data.message);
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，跳转到登录页
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    throw error;
  }
);

export default apiClient;
```

## 🔐 认证管理

### 1. 登录功能
```javascript
// api/auth.js
import apiClient from './client';

export const authAPI = {
  // 登录
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    // 保存Token
    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    return response;
  },

  // 获取当前用户信息
  async getProfile() {
    return await apiClient.get('/auth/profile');
  },

  // 登出
  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  },

  // 检查是否已登录
  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  },

  // 获取当前用户
  getCurrentUser() {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
};
```

### 2. 登录页面组件示例
```vue
<!-- Login.vue -->
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>后台管理系统登录</h2>
      
      <div class="form-group">
        <label>邮箱</label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
          placeholder="请输入邮箱"
        />
      </div>
      
      <div class="form-group">
        <label>密码</label>
        <input 
          v-model="form.password" 
          type="password" 
          required 
          placeholder="请输入密码"
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { authAPI } from '@/api/auth';

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        await authAPI.login(this.form);
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.message || '登录失败';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## 👥 用户管理

### 1. 用户API封装
```javascript
// api/users.js
import apiClient from './client';

export const usersAPI = {
  // 获取用户列表
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/users?${queryString}`);
  },

  // 创建用户
  async createUser(userData) {
    return await apiClient.post('/users', userData);
  },

  // 获取用户详情
  async getUser(id) {
    return await apiClient.get(`/users/${id}`);
  },

  // 更新用户
  async updateUser(id, userData) {
    return await apiClient.patch(`/users/${id}`, userData);
  },

  // 删除用户
  async deleteUser(id) {
    return await apiClient.delete(`/users/${id}`);
  },

  // 封禁用户
  async banUser(id) {
    return await apiClient.patch(`/users/${id}/ban`);
  },

  // 解封用户
  async unbanUser(id) {
    return await apiClient.patch(`/users/${id}/unban`);
  },

  // 修改密码
  async changePassword(id, passwordData) {
    return await apiClient.patch(`/users/${id}/password`, passwordData);
  },

  // 获取用户统计
  async getUserStats() {
    return await apiClient.get('/users/stats');
  }
};
```

### 2. 用户列表页面组件
```vue
<!-- UserList.vue -->
<template>
  <div class="user-list">
    <div class="page-header">
      <h1>用户管理</h1>
      <button @click="showCreateModal = true" class="btn-primary">
        新增用户
      </button>
    </div>

    <!-- 搜索筛选 -->
    <div class="filters">
      <input 
        v-model="filters.keyword" 
        placeholder="搜索用户名、邮箱、昵称"
        @input="handleSearch"
      />
      <select v-model="filters.role" @change="handleSearch">
        <option value="">全部角色</option>
        <option value="admin">管理员</option>
        <option value="user">普通用户</option>
      </select>
      <select v-model="filters.status" @change="handleSearch">
        <option value="">全部状态</option>
        <option value="active">正常</option>
        <option value="banned">已封禁</option>
      </select>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>昵称</th>
            <th>角色</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.nickname || '-' }}</td>
            <td>
              <span :class="['role-badge', user.role]">
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', user.status]">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="actions">
                <button @click="editUser(user)" class="btn-sm">编辑</button>
                <button 
                  @click="toggleUserStatus(user)" 
                  :class="['btn-sm', user.status === 'banned' ? 'btn-success' : 'btn-warning']"
                >
                  {{ user.status === 'banned' ? '解封' : '封禁' }}
                </button>
                <button @click="deleteUser(user)" class="btn-sm btn-danger">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage(pagination.page - 1)"
        :disabled="!pagination.hasPrev"
      >
        上一页
      </button>
      <span>第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页</span>
      <button 
        @click="changePage(pagination.page + 1)"
        :disabled="!pagination.hasNext"
      >
        下一页
      </button>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <UserModal 
      v-if="showCreateModal || showEditModal"
      :user="editingUser"
      :is-edit="showEditModal"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script>
import { usersAPI } from '@/api/users';
import UserModal from './UserModal.vue';

export default {
  components: {
    UserModal
  },
  data() {
    return {
      users: [],
      pagination: {},
      filters: {
        keyword: '',
        role: '',
        status: '',
        page: 1,
        limit: 20
      },
      loading: false,
      showCreateModal: false,
      showEditModal: false,
      editingUser: null
    };
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await usersAPI.getUsers(this.filters);
        this.users = response.data;
        this.pagination = {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
          hasNext: response.hasNext,
          hasPrev: response.hasPrev
        };
      } catch (error) {
        this.$message.error('加载用户列表失败');
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.filters.page = 1;
      this.loadUsers();
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.filters.page = page;
        this.loadUsers();
      }
    },

    editUser(user) {
      this.editingUser = { ...user };
      this.showEditModal = true;
    },

    async toggleUserStatus(user) {
      try {
        if (user.status === 'banned') {
          await usersAPI.unbanUser(user.id);
          this.$message.success('用户已解封');
        } else {
          await usersAPI.banUser(user.id);
          this.$message.success('用户已封禁');
        }
        await this.loadUsers();
      } catch (error) {
        this.$message.error('操作失败');
      }
    },

    async deleteUser(user) {
      if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
        try {
          await usersAPI.deleteUser(user.id);
          this.$message.success('用户已删除');
          await this.loadUsers();
        } catch (error) {
          this.$message.error('删除失败');
        }
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.editingUser = null;
    },

    async handleModalSuccess() {
      this.closeModal();
      await this.loadUsers();
    },

    getStatusText(status) {
      const statusMap = {
        active: '正常',
        inactive: '未激活',
        banned: '已封禁'
      };
      return statusMap[status] || status;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN');
    }
  }
};
</script>
```
