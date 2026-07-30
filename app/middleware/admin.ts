export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only apply to admin routes
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const adminStore = useAdminStore()
    await adminStore.checkAuth()
    
    if (!adminStore.isAuthenticated) {
      return navigateTo('/admin/login')
    }
  }
})
