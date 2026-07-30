import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)

  async function checkAuth() {
    try {
      const res: any = await $fetch('/api/admin/session')
      isAuthenticated.value = !!res?.isAdmin
    } catch (e) {
      isAuthenticated.value = false
    }
  }

  async function login(username: string, password: string) {
    try {
      const res: any = await $fetch('/api/admin/login', {
        method: 'POST',
        body: { username, password }
      })
      if (res.success) {
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/admin/logout', { method: 'POST' })
      isAuthenticated.value = false
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  return { isAuthenticated, checkAuth, login, logout }
})
