import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/dashboard',
      component: () => import('@/components/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: '仪表板' }
        },
        {
          path: '/posts',
          name: 'Posts',
          component: () => import('@/views/PostsView.vue'),
          meta: { title: '文章管理' }
        },
        {
          path: '/users',
          name: 'Users',
          component: () => import('@/views/UsersView.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/categories',
          name: 'Categories',
          component: () => import('@/views/CategoriesView.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: '/tags',
          name: 'Tags',
          component: () => import('@/views/TagsView.vue'),
          meta: { title: '标签管理' }
        },
        {
          path: '/comments',
          name: 'Comments',
          component: () => import('@/views/CommentsView.vue'),
          meta: { title: '评论管理' }
        },
        {
          path: '/settings',
          name: 'Settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: { title: '系统设置' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }
  }

  // 如果已登录用户访问登录页，重定向到仪表板
  if (to.name === 'Login' && userStore.isLoggedIn) {
    next('/dashboard')
    return
  }

  next()
})

export default router