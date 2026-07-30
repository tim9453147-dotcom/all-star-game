<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-900 via-[#0f172a] to-[#1e1b4b] text-white font-sans">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-surface-900/70 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xl font-black shadow-lg shadow-accent-500/30 group-hover:shadow-accent-500/50 transition-shadow">
              🎲
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
              積分大富翁
            </span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              :class="$route.path === link.to ? 'bg-white/10 text-white' : 'text-surface-300'"
            >
              {{ link.icon }} {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 bg-surface-900/95 backdrop-blur-xl">
          <div class="px-4 py-3 space-y-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
              :class="$route.path === link.to ? 'bg-white/10 text-white' : 'text-surface-300'"
              @click="mobileMenuOpen = false"
            >
              {{ link.icon }} {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-6 text-center text-surface-500 text-sm">
      <p>© {{ new Date().getFullYear() }} 積分大富翁 — 累積積分，贏取獎勵</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: '棋盤', icon: '🎮' },
  { to: '/rewards', label: '獎勵', icon: '🎁' },
  { to: '/apply', label: '加入遊戲', icon: '🚀' },
]
</script>
