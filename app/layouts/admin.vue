<template>
  <div class="min-h-screen bg-surface-900 text-surface-50 flex flex-col md:flex-row font-sans">
    <!-- Mobile Header -->
    <header class="md:hidden sticky top-0 z-40 bg-surface-900/90 backdrop-blur-xl border-b border-surface-800 px-4 py-3 flex items-center justify-between shadow-lg">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-black shadow-md shadow-primary-500/20">
          ⚙️
        </div>
        <div>
          <h1 class="text-sm font-bold text-white leading-tight">All-Star 管理後台</h1>
          <p class="text-[11px] text-primary-400 font-medium leading-none">{{ currentPageTitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/"
          class="px-2.5 py-1.5 rounded-xl bg-surface-800 border border-white/10 text-xs font-semibold text-surface-300 hover:text-white active:scale-95 transition flex items-center gap-1"
        >
          <span>← 前台</span>
        </NuxtLink>
        <button
          class="p-2 rounded-xl bg-surface-800 border border-white/10 text-surface-200 active:scale-95 transition hover:bg-surface-700"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle Menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
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
        class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 md:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar (Desktop & Mobile Drawer) -->
    <aside
      class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface-800 border-r border-surface-700/80 flex flex-col shrink-0 transition-transform duration-300 ease-out md:translate-x-0 shadow-2xl md:shadow-none"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="p-6 border-b border-surface-700/80 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-base font-black shadow-lg shadow-primary-500/25">
            ⚙️
          </div>
          <div>
            <h1 class="text-base font-bold text-white">All-Star 管理</h1>
            <p class="text-xs text-surface-400">控制面板</p>
          </div>
        </div>
        <button class="md:hidden text-surface-400 hover:text-white p-1" @click="sidebarOpen = false">
          ✕
        </button>
      </div>

      <nav class="flex-1 py-4 flex flex-col gap-1.5 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link flex items-center justify-between"
          active-class="nav-active"
          exact
          @click="sidebarOpen = false"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </div>
          <span
            v-if="item.to === '/admin/players' && dashboard?.pendingPlayers > 0"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
          >
            {{ dashboard.pendingPlayers }} 待審
          </span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-surface-700/80 flex flex-col gap-2">
        <NuxtLink to="/" class="nav-link text-surface-400 hover:text-surface-200" @click="sidebarOpen = false">
          ← 返回前台
        </NuxtLink>
        <button
          @click="handleLogout"
          class="nav-link text-red-400 hover:text-red-300 hover:bg-red-950/40 text-left w-full flex items-center gap-2"
        >
          <span>🚪</span>
          <span>登出系統</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Container -->
    <main class="flex-1 overflow-auto p-4 sm:p-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-900/95 backdrop-blur-xl border-t border-surface-800 px-3 py-2 flex items-center justify-around shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
      <NuxtLink
        v-for="item in navItems"
        :key="'bottom-' + item.to"
        :to="item.to"
        class="relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95"
        :class="route.path === item.to ? 'text-primary-400 font-bold bg-surface-800/80 border border-white/5' : 'text-surface-400 font-medium hover:text-surface-200'"
        exact
      >
        <div class="relative">
          <span class="text-xl leading-none mb-1 block">{{ item.icon }}</span>
          <!-- Pending Badge -->
          <span
            v-if="item.to === '/admin/players' && dashboard?.pendingPlayers > 0"
            class="absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[9px] font-black rounded-full bg-amber-500 text-black flex items-center justify-center animate-pulse shadow-sm shadow-amber-500/50"
          >
            {{ dashboard.pendingPlayers }}
          </span>
        </div>
        <span class="text-[11px] leading-tight">{{ item.label }}</span>
        <!-- Glowing active bar below icon -->
        <span
          v-if="route.path === item.to"
          class="absolute bottom-0.5 w-6 h-0.5 rounded-full bg-primary-400 shadow-sm shadow-primary-400/80"
        />
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const { data: dashboard } = await useFetch<any>('/api/admin/dashboard')

const navItems = [
  { to: '/admin', label: '儀表板', icon: '📊' },
  { to: '/admin/players', label: '玩家管理', icon: '👥' },
  { to: '/admin/tasks', label: '任務管理', icon: '📋' },
  { to: '/admin/scores', label: '積分管理', icon: '⭐' },
]

const currentPageTitle = computed(() => {
  const current = navItems.find(item => item.to === route.path)
  return current ? current.label : '管理後台'
})

const handleLogout = async () => {
  sidebarOpen.value = false
  await adminStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-5 py-3 transition-colors text-surface-300 hover:text-surface-100 hover:bg-surface-700/60 rounded-xl mx-3 text-sm font-medium;
}
.nav-active {
  @apply text-primary-400 bg-surface-700 font-semibold shadow-inner;
}
</style>

