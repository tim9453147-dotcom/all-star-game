<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-900 via-[#0f172a] to-[#1e1b4b] text-white font-sans flex flex-col pb-20 md:pb-0">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 backdrop-blur-xl bg-surface-900/80 border-b border-white/10 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xl font-black shadow-lg shadow-accent-500/30 group-hover:scale-105 transition-transform">
              🎲
            </div>
            <span class="text-xl font-extrabold bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
              積分大富翁
            </span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:bg-white/10"
              :class="$route.path === link.to ? 'bg-primary-600/30 text-white border border-primary-500/30 shadow-sm' : 'text-surface-300'"
            >
              <span>{{ link.icon }}</span>
              <span>{{ link.label }}</span>
            </NuxtLink>
          </div>

          <!-- Mobile Top Right Admin Button -->
          <div class="flex md:hidden items-center gap-2">
            <NuxtLink
              to="/admin"
              class="p-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-white text-xs flex items-center gap-1.5 active:scale-95 transition"
            >
              <span>⚙️</span>
              <span class="font-medium">管理</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation Bar (Dock) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div class="grid grid-cols-3 gap-1 max-w-sm mx-auto">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95"
          :class="$route.path === link.to ? 'text-accent-400 bg-white/10 font-bold' : 'text-surface-400 hover:text-surface-200'"
        >
          <span class="text-xl mb-0.5 leading-none">{{ link.icon }}</span>
          <span class="text-[11px] font-medium tracking-tight">{{ link.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-8 text-center text-surface-500 text-xs sm:text-sm px-4">
      <p>© {{ new Date().getFullYear() }} 積分大富翁 — 累積積分，贏取獎勵</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navLinks = [
  { to: '/', label: '棋盤', icon: '🎮' },
  { to: '/rewards', label: '獎勵', icon: '🎁' },
  { to: '/apply', label: '加入遊戲', icon: '🚀' },
]
</script>
