<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface-800/50 border border-white/10 rounded-2xl p-5 hover:bg-surface-800/70 transition-all"
      >
        <div class="text-2xl mb-2">{{ stat.icon }}</div>
        <div class="text-2xl font-black text-white">{{ stat.value }}</div>
        <div class="text-sm text-surface-400">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-surface-800/50 border border-white/10 rounded-2xl p-6">
      <h3 class="text-lg font-bold mb-4">⚡ 快速操作</h3>
      <div class="grid sm:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/scores"
          class="block p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl hover:bg-accent-500/20 transition-all"
        >
          <div class="font-bold text-accent-300">⭐ 新增積分</div>
          <div class="text-sm text-surface-400 mt-1">幫玩家新增任務積分</div>
        </NuxtLink>
        <NuxtLink
          to="/admin/players"
          class="block p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl hover:bg-primary-500/20 transition-all"
        >
          <div class="font-bold text-primary-300">
            👥 審核申請
            <span v-if="dashboard?.pendingPlayers" class="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
              {{ dashboard.pendingPlayers }} 待審核
            </span>
          </div>
          <div class="text-sm text-surface-400 mt-1">審核玩家加入申請</div>
        </NuxtLink>
        <NuxtLink
          to="/admin/tasks"
          class="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
        >
          <div class="font-bold">📋 管理任務</div>
          <div class="text-sm text-surface-400 mt-1">新增或修改任務與積分</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: dashboard } = await useFetch<any>('/api/admin/dashboard')

const stats = computed(() => [
  { icon: '👥', value: dashboard.value?.totalPlayers ?? 0, label: '活躍玩家' },
  { icon: '⏳', value: dashboard.value?.pendingPlayers ?? 0, label: '待審核' },
  { icon: '📝', value: dashboard.value?.todayScoreRecords ?? 0, label: '今日新增' },
  { icon: '⭐', value: dashboard.value?.todayPoints ?? 0, label: '今日積分' },
])

useHead({ title: '管理後台 - Dashboard' })
</script>
