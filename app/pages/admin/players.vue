<template>
  <div class="space-y-5">
    <!-- Top Bar with Search & Quick Summary -->
    <div class="bg-surface-800/40 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>👥 玩家管理</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 font-mono font-bold">
            共 {{ (players || []).length }} 人
          </span>
        </h2>
        <p class="text-xs text-surface-400 mt-0.5">審核玩家報名、檢視積分與變更狀態</p>
      </div>

      <!-- Real-time Search Input -->
      <div class="relative min-w-[240px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋姓名或 Player ID..."
          class="w-full pl-9 pr-8 py-2.5 bg-surface-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
        />
        <span class="absolute left-3 top-2.5 text-surface-400 text-sm">🔍</span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-2.5 text-surface-400 hover:text-white text-xs p-0.5 rounded-md"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Filter Tabs (Segmented Control) -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar sticky top-[57px] md:top-0 z-20 py-2 bg-surface-900/90 backdrop-blur-md">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 flex items-center gap-1.5 shadow-sm"
        :class="activeTab === tab.value
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-1 ring-primary-400/50'
          : 'bg-surface-800/80 text-surface-400 hover:bg-surface-700 hover:text-white border border-white/5'"
        @click="activeTab = tab.value"
      >
        <span>{{ tab.label }}</span>
        <span
          class="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
          :class="activeTab === tab.value ? 'bg-white/25 text-white' : 'bg-surface-700 text-surface-300'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Status Toast Message -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="message"
        class="p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg"
        :class="messageType === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'"
      >
        <span class="flex items-center gap-2">
          <span>{{ messageType === 'success' ? '✅' : '❌' }}</span>
          <span>{{ message }}</span>
        </span>
        <button @click="message = ''" class="opacity-60 hover:opacity-100">✕</button>
      </div>
    </Transition>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="player in filteredPlayers"
        :key="'card-' + player.id"
        class="bg-gradient-to-br from-surface-800/90 to-surface-800/50 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden group"
      >
        <!-- Top Row: Avatar, Name, Status Badge, Score -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500/25 to-accent-500/25 border border-primary-500/30 text-primary-300 flex items-center justify-center font-black text-base shrink-0 shadow-md">
              {{ player.name ? player.name.charAt(0) : '?' }}
            </div>
            <div>
              <div class="font-black text-base text-white flex items-center gap-2 leading-tight">
                <span>{{ player.name }}</span>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 rounded-md bg-surface-900/80 border border-white/10 text-[11px] font-mono text-surface-300">
                  ID: {{ player.player_id }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': player.status === 'active',
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse': player.status === 'pending',
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30': player.status === 'inactive',
                  }"
                >
                  {{ statusLabels[player.status] || player.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <div class="text-[10px] text-surface-400 font-medium">總積分</div>
            <div class="text-xl font-black text-amber-400 flex items-center justify-end gap-0.5">
              <span>⭐</span>
              <span>{{ player.total_score }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Date & Mobile Action Buttons -->
        <div class="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-surface-400">
          <div class="text-[11px] text-surface-400 flex items-center gap-1">
            <span>🕒</span>
            <span>{{ formatDate(player.created_at) }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="player.status === 'pending'"
              class="px-4 py-2 min-h-[40px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center gap-1"
              @click="updateStatus(player.id, 'active')"
            >
              <span>✓</span>
              <span>通過</span>
            </button>
            <button
              v-if="player.status === 'pending'"
              class="px-3.5 py-2 min-h-[40px] bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 active:scale-95 transition flex items-center gap-1"
              @click="updateStatus(player.id, 'inactive')"
            >
              <span>✗</span>
              <span>拒絕</span>
            </button>
            <button
              v-if="player.status === 'active'"
              class="px-3.5 py-2 min-h-[40px] bg-surface-700 border border-white/10 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 active:scale-95 transition"
              @click="updateStatus(player.id, 'inactive')"
            >
              停用
            </button>
            <button
              v-if="player.status === 'inactive'"
              class="px-3.5 py-2 min-h-[40px] bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-xl text-xs font-bold hover:bg-primary-500/30 active:scale-95 transition"
              @click="updateStatus(player.id, 'active')"
            >
              重新啟用
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPlayers.length === 0" class="bg-surface-800/30 border border-white/5 rounded-2xl p-8 text-center text-surface-400">
        <div class="text-3xl mb-2">🔍</div>
        <p class="text-sm font-semibold">找不到符合條件的玩家</p>
        <p class="text-xs text-surface-500 mt-1">請嘗試調整搜尋關鍵字或篩選標籤</p>
        <button
          v-if="searchQuery || activeTab !== 'all'"
          @click="searchQuery = ''; activeTab = 'all'"
          class="mt-3 px-4 py-1.5 bg-surface-700 text-surface-200 rounded-xl text-xs font-bold hover:bg-surface-600 transition"
        >
          重設篩選
        </button>
      </div>
    </div>

    <!-- Desktop Table View (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10 bg-surface-800/80 text-surface-400">
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Player ID</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">玩家姓名</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">總積分</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">目前狀態</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">加入時間</th>
              <th class="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="player in filteredPlayers"
              :key="player.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-mono text-surface-300 font-semibold">{{ player.player_id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center justify-center text-xs font-bold">
                    {{ player.name ? player.name.charAt(0) : '?' }}
                  </div>
                  <span class="text-sm font-bold text-white">{{ player.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-amber-400 font-black">⭐ {{ player.total_score }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': player.status === 'active',
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30': player.status === 'pending',
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30': player.status === 'inactive',
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="player.status === 'active' ? 'bg-emerald-400' : player.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'" />
                  {{ statusLabels[player.status] || player.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-surface-400">{{ formatDate(player.created_at) }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    v-if="player.status === 'pending'"
                    class="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition active:scale-95"
                    @click="updateStatus(player.id, 'active')"
                  >
                    ✓ 通過
                  </button>
                  <button
                    v-if="player.status === 'pending'"
                    class="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition active:scale-95"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    ✗ 拒絕
                  </button>
                  <button
                    v-if="player.status === 'active'"
                    class="px-3 py-1.5 bg-surface-700 border border-white/10 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 transition active:scale-95"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    停用
                  </button>
                  <button
                    v-if="player.status === 'inactive'"
                    class="px-3 py-1.5 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-xl text-xs font-bold hover:bg-primary-500/30 transition active:scale-95"
                    @click="updateStatus(player.id, 'active')"
                  >
                    啟用
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredPlayers.length === 0" class="text-center py-12 text-surface-400 text-sm">
          沒有符合條件的玩家紀錄
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
const searchQuery = ref('')
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
  let all = players.value || []
  if (activeTab.value !== 'all') {
    all = all.filter(p => p.status === activeTab.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    all = all.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.player_id && p.player_id.toLowerCase().includes(q)))
  }
  return all
})

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d + 'Z').toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function updateStatus(id: number, status: string) {
  try {
    await $fetch(`/api/admin/players/${id}`, { method: 'PATCH', body: { status } })
    message.value = '更新狀態成功！'
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

