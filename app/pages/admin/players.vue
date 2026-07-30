<template>
  <div>
    <!-- Filter Tabs -->
    <div class="flex gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95"
        :class="activeTab === tab.value
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
          : 'bg-surface-800/80 text-surface-300 hover:bg-surface-700'"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] sm:text-xs font-mono">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Status Message -->
    <div v-if="message" class="mb-4 p-4 rounded-xl text-xs sm:text-sm font-semibold" :class="messageType === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
      {{ message }}
    </div>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="player in filteredPlayers"
        :key="'card-' + player.id"
        class="bg-surface-800/60 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="font-bold text-base text-white flex items-center gap-2">
              <span>{{ player.name }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="{
                  'bg-green-500/20 text-green-400 border border-green-500/30': player.status === 'active',
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': player.status === 'pending',
                  'bg-red-500/20 text-red-400 border border-red-500/30': player.status === 'inactive',
                }"
              >
                {{ statusLabels[player.status] || player.status }}
              </span>
            </div>
            <div class="text-xs text-surface-400 font-mono mt-0.5">ID: {{ player.player_id }}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-surface-400">總積分</div>
            <div class="text-lg font-black text-accent-400">{{ player.total_score }}</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-surface-400">
          <div>加入於 {{ formatDate(player.created_at) }}</div>
          <div class="flex gap-2">
            <button
              v-if="player.status === 'pending'"
              class="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold hover:bg-green-500/30 transition active:scale-95"
              @click="updateStatus(player.id, 'active')"
            >
              ✓ 通過
            </button>
            <button
              v-if="player.status === 'pending'"
              class="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition active:scale-95"
              @click="updateStatus(player.id, 'inactive')"
            >
              ✗ 拒絕
            </button>
            <button
              v-if="player.status === 'active'"
              class="px-3 py-1.5 bg-surface-700 text-surface-300 rounded-xl font-semibold hover:bg-surface-600 transition active:scale-95"
              @click="updateStatus(player.id, 'inactive')"
            >
              停用
            </button>
            <button
              v-if="player.status === 'inactive'"
              class="px-3 py-1.5 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-xl font-bold hover:bg-primary-500/30 transition active:scale-95"
              @click="updateStatus(player.id, 'active')"
            >
              啟用
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredPlayers.length === 0" class="text-center py-12 text-surface-400 text-sm">
        沒有符合的玩家
      </div>
    </div>

    <!-- Desktop Table View (>= md) -->
    <div class="hidden md:block bg-surface-800/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10 bg-surface-800/80">
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">Player ID</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">姓名</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">積分</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">狀態</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">加入時間</th>
              <th class="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in filteredPlayers"
              :key="player.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-mono text-surface-300">{{ player.player_id }}</td>
              <td class="px-6 py-4 text-sm font-semibold">{{ player.name }}</td>
              <td class="px-6 py-4 text-sm text-accent-400 font-bold">{{ player.total_score }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-500/20 text-green-400': player.status === 'active',
                    'bg-yellow-500/20 text-yellow-400': player.status === 'pending',
                    'bg-red-500/20 text-red-400': player.status === 'inactive',
                  }"
                >
                  {{ statusLabels[player.status] || player.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-surface-400">{{ formatDate(player.created_at) }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    v-if="player.status === 'pending'"
                    class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition"
                    @click="updateStatus(player.id, 'active')"
                  >
                    ✓ 通過
                  </button>
                  <button
                    v-if="player.status === 'pending'"
                    class="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    ✗ 拒絕
                  </button>
                  <button
                    v-if="player.status === 'active'"
                    class="px-3 py-1.5 bg-surface-600/50 text-surface-300 rounded-lg text-xs font-semibold hover:bg-surface-600 transition"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    停用
                  </button>
                  <button
                    v-if="player.status === 'inactive'"
                    class="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-lg text-xs font-semibold hover:bg-primary-500/30 transition"
                    @click="updateStatus(player.id, 'active')"
                  >
                    啟用
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredPlayers.length === 0" class="text-center py-12 text-surface-400">
          沒有符合的玩家
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Player {
  id: number
  player_id: string
  name: string
  total_score: number
  status: string
  created_at: string
}

const { data: players, refresh } = await useFetch<Player[]>('/api/admin/players')
const activeTab = ref('all')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const statusLabels: Record<string, string> = {
  active: '已啟用',
  pending: '待審核',
  inactive: '已停用',
}

const tabs = computed(() => {
  const all = players.value || []
  return [
    { label: '全部', value: 'all', count: all.length },
    { label: '待審核', value: 'pending', count: all.filter(p => p.status === 'pending').length },
    { label: '已啟用', value: 'active', count: all.filter(p => p.status === 'active').length },
    { label: '已停用', value: 'inactive', count: all.filter(p => p.status === 'inactive').length },
  ]
})

const filteredPlayers = computed(() => {
  const all = players.value || []
  if (activeTab.value === 'all') return all
  return all.filter(p => p.status === activeTab.value)
})

function formatDate(d: string) {
  return new Date(d + 'Z').toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function updateStatus(id: number, status: string) {
  try {
    await $fetch(`/api/admin/players/${id}`, { method: 'PATCH', body: { status } })
    message.value = '更新成功！'
    messageType.value = 'success'
    await refresh()
  } catch (e: any) {
    message.value = e.data?.message || '更新失敗'
    messageType.value = 'error'
  }
  setTimeout(() => { message.value = '' }, 3000)
}

useHead({ title: '管理後台 - 玩家管理' })
</script>

