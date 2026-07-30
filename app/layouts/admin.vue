<template>
  <div class="min-h-screen bg-surface-900 text-surface-50 flex flex-col md:flex-row font-sans">
    <!-- Mobile Header -->
    <header class="md:hidden sticky top-0 z-40 bg-surface-800/90 backdrop-blur-xl border-b border-surface-700 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-black">
          ⚙️
        </div>
        <h1 class="text-base font-bold text-primary-400">All-Star管理</h1>
      </div>
      <button
        class="p-2 rounded-xl bg-surface-700/50 hover:bg-surface-700 text-surface-200 active:scale-95 transition"
        @click="sidebarOpen = !sidebarOpen"
        aria-label="Toggle Menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Mobile Sidebar Drawer Backdrop -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar (Desktop & Mobile Drawer) -->
    <aside
      class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface-800 border-r border-surface-700 flex flex-col shrink-0 transition-transform duration-300 ease-out md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="p-6 border-b border-surface-700 flex items-center justify-between">
        <h1 class="text-xl font-bold text-primary-400">All-Star管理</h1>
        <button class="md:hidden text-surface-400 hover:text-white" @click="sidebarOpen = false">
          ✕
        </button>
      </div>

      <nav class="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-active"
          exact
          @click="sidebarOpen = false"
        >
          {{ item.icon }} {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-surface-700 flex flex-col gap-2">
        <NuxtLink to="/" class="nav-link text-surface-400 hover:text-surface-200" @click="sidebarOpen = false">
          ← 返回前台
        </NuxtLink>
        <button
          @click="handleLogout"
          class="nav-link text-red-400 hover:text-red-300 hover:bg-red-900/20 text-left w-full"
        >
          🚪 登出
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-4 sm:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const adminStore = useAdminStore()
const router = useRouter()

const navItems = [
  { to: '/admin', label: '儀表板', icon: '📊' },
  { to: '/admin/players', label: '玩家管理', icon: '👥' },
  { to: '/admin/tasks', label: '任務管理', icon: '📋' },
  { to: '/admin/scores', label: '積分管理', icon: '⭐' },
]

const handleLogout = async () => {
  sidebarOpen.value = false
  await adminStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-5 py-3 block transition-colors text-surface-300 hover:text-surface-100 hover:bg-surface-700/60 rounded-xl mx-3 text-sm font-medium;
}
.nav-active {
  @apply text-primary-400 bg-surface-700 font-semibold shadow-inner;
}
</style>

