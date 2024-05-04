import { createRouter, createWebHistory } from 'vue-router'
import { useSettingsStore } from "@/stores/settings";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/Main.vue')
    },
    {
      path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
      path: '/interactive',
        name: 'Interactive',
        component: () => import('../views/Interactive.vue')
    },
    {
      path: '/manual',
      name: "Manual",
      component: () => import('../views/Manual.vue')
    },
    {
      path: '/prompt',
        name: "Prompt",
        component: () => import('../views/Prompt.vue')
    },
    {
      path: '/*',
        redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const settingsStore = useSettingsStore()
  if (to.name === 'Login') {
      next()
  }
    else if (!settingsStore.authToken) {
        next({ name: 'Login' })
    } else {
        next()
    }
})

export default router
