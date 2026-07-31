<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-900 via-[#0f172a] to-[#1e1b4b] text-white font-sans flex flex-col">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 backdrop-blur-xl bg-surface-900/80 border-b border-white/10 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo / Title -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <span class="text-xl font-extrabold bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
              All-Star
            </span>
          </NuxtLink>

          <!-- Top Navigation Right Actions -->
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="showJoinModal = true"
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-md active:scale-95 cursor-pointer"
            >
              <span>🚀</span>
              <span>join us</span>
            </button>

            <button
              type="button"
              @click="handleAdminClick"
              class="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-white text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <span>⚙️</span>
              <span class="font-medium">管理</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Join Us Pop-up Modal -->
    <JoinUsModal :show="showJoinModal" @close="showJoinModal = false" />

    <!-- Admin Login Pop-up Modal -->
    <AdminLoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const adminStore = useAdminStore()
const router = useRouter()

const showJoinModal = ref(false)
const showLoginModal = ref(false)

async function handleAdminClick() {
  await adminStore.checkAuth()
  if (adminStore.isAuthenticated) {
    router.push('/admin')
  } else {
    showLoginModal.value = true
  }
}

function handleLoginSuccess() {
  showLoginModal.value = false
  router.push('/admin')
}
</script>


