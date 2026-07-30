<template>
  <div class="min-h-screen bg-surface-900 text-surface-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-surface-800 border-r border-surface-700 flex flex-col shrink-0">
      <div class="p-6 border-b border-surface-700">
        <h1 class="text-xl font-bold text-primary-400">積分大富翁管理</h1>
      </div>
      <nav class="flex-1 py-4 flex flex-col gap-1">
        <NuxtLink to="/admin" class="nav-link" active-class="nav-active" exact>📊 儀表板</NuxtLink>
        <NuxtLink to="/admin/players" class="nav-link" active-class="nav-active">👥 玩家管理</NuxtLink>
        <NuxtLink to="/admin/tasks" class="nav-link" active-class="nav-active">📋 任務管理</NuxtLink>
        <NuxtLink to="/admin/scores" class="nav-link" active-class="nav-active">⭐ 積分管理</NuxtLink>
        <NuxtLink to="/admin/rewards" class="nav-link" active-class="nav-active">🎁 獎勵管理</NuxtLink>
      </nav>
      <div class="p-4 border-t border-surface-700 flex flex-col gap-2">
        <NuxtLink to="/" class="nav-link text-surface-400 hover:text-surface-200">← 返回前台</NuxtLink>
        <button @click="handleLogout" class="nav-link text-red-400 hover:text-red-300 hover:bg-red-900/20 text-left w-full">
          🚪 登出
        </button>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const router = useRouter()

const handleLogout = async () => {
  await adminStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-6 py-3 block transition-colors text-surface-300 hover:text-surface-100 hover:bg-surface-700 rounded-lg mx-2;
}
.nav-active {
  @apply text-primary-400 bg-surface-700/50 font-medium;
}
</style>
