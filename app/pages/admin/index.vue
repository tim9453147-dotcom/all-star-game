<template>
  <div class="space-y-6">
    <!-- Mobile Alert Banner for Pending Approvals -->
    <div
      v-if="dashboard?.pendingPlayers > 0"
      class="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
          ⚠️
        </div>
        <div>
          <h4 class="text-sm font-bold text-amber-300">有待審核玩家加入</h4>
          <p class="text-xs text-amber-200/80 mt-0.5">共有 {{ dashboard.pendingPlayers }} 位玩家等待您的核准</p>
        </div>
      </div>
      <NuxtLink
        to="/admin/players"
        class="px-3.5 py-2 bg-amber-500 text-surface-950 hover:bg-amber-400 font-bold rounded-xl text-xs shrink-0 shadow-md active:scale-95 transition"
      >
        前往審核 →
      </NuxtLink>
    </div>

    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>📊 總覽儀表板</span>
        </h2>
        <p class="text-xs sm:text-sm text-surface-400 mt-0.5">即時檢視賽事數據與 quick control</p>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="relative overflow-hidden bg-gradient-to-br from-surface-800/80 to-surface-800/40 border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-surface-800/90 transition-all shadow-lg group"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">{{ stat.icon }}</span>
          <span
            v-if="stat.badge"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full"
            :class="stat.badgeClass"
          >
            {{ stat.badge }}
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{{ stat.value }}</div>
        <div class="text-xs text-surface-400 font-medium">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="bg-surface-800/40 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-primary-400">⚡</span> 快速快捷操作
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NuxtLink
          to="/admin/scores"
          class="group p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center sm:block gap-4"
        >
          <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform sm:mb-3">
            ⭐
          </div>
          <div>
            <div class="font-bold text-sm text-amber-200 group-hover:text-amber-100 transition-colors flex items-center justify-between">
              <span>新增積分</span>
              <span class="text-xs opacity-60 sm:hidden">→</span>
            </div>
            <div class="text-xs text-surface-400 mt-0.5">發放任務或挑戰積分</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/players"
          class="group p-4 bg-gradient-to-br from-primary-500/10 to-primary-500/5 border border-primary-500/20 hover:border-primary-500/40 rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center sm:block gap-4"
        >
          <div class="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform sm:mb-3">
            👥
          </div>
          <div>
            <div class="font-bold text-sm text-primary-200 group-hover:text-primary-100 transition-colors flex items-center justify-between">
              <span>玩家管理</span>
              <span v-if="dashboard?.pendingPlayers" class="px-2 py-0.5 bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold">
                {{ dashboard.pendingPlayers }} 待審
              </span>
            </div>
            <div class="text-xs text-surface-400 mt-0.5">審核資格與權限設定</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/tasks"
          class="group p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center sm:block gap-4"
        >
          <div class="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform sm:mb-3">
            📋
          </div>
          <div>
            <div class="font-bold text-sm text-indigo-200 group-hover:text-indigo-100 transition-colors flex items-center justify-between">
              <span>管理任務</span>
              <span class="text-xs opacity-60 sm:hidden">→</span>
            </div>
            <div class="text-xs text-surface-400 mt-0.5">新增或修改賽事任務</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: dashboard } = await useFetch<any>('/api/admin/dashboard')

const stats = computed(() => [
  {
    icon: '👥',
    value: dashboard.value?.totalPlayers ?? 0,
    label: '總玩家數',
    badge: '總計',
    badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
  {
    icon: '⏳',
    value: dashboard.value?.pendingPlayers ?? 0,
    label: '待審核玩家',
    badge: dashboard.value?.pendingPlayers > 0 ? '需處理' : '全通過',
    badgeClass: dashboard.value?.pendingPlayers > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  {
    icon: '📝',
    value: dashboard.value?.todayScoreRecords ?? 0,
    label: '今日新增紀錄',
    badge: '今日',
    badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  },
  {
    icon: '⭐',
    value: dashboard.value?.todayPoints ?? 0,
    label: '今日發放積分',
    badge: '積分',
    badgeClass: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
  },
])

useHead({ title: '管理後台 - Dashboard' })
</script>
