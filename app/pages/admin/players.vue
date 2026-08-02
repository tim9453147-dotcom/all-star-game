<template>
  <div class="space-y-4">
    <!-- Header & Action Bar -->
    <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-surface-800/40 border border-surface-700/60 rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <h2 class="text-base sm:text-lg font-bold text-white tracking-wide">玩家管理</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-300 border border-surface-600 font-mono font-medium">
          {{ (players || []).length }} 人
        </span>
      </div>

      <!-- Real-time Search Input -->
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋姓名或 ID..."
          class="w-full pl-8 pr-7 py-1.5 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 transition"
        />
        <span class="absolute left-2.5 top-2 text-surface-400 text-xs">🔍</span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-2 text-surface-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar sticky top-[57px] md:top-0 z-20 py-1.5 bg-surface-900/95 backdrop-blur-md border-b border-surface-800">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5"
        :class="activeTab === tab.value
          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
          : 'bg-surface-800/60 text-surface-400 hover:text-surface-200 border border-transparent'"
        @click="activeTab = tab.value"
      >
        <span>{{ tab.label }}</span>
        <span
          class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
          :class="activeTab === tab.value ? 'bg-primary-500/30 text-primary-200' : 'bg-surface-700 text-surface-400'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Toast Message -->
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
        class="p-3 rounded-lg text-xs font-medium flex items-center justify-between shadow-md"
        :class="messageType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'"
      >
        <span>{{ message }}</span>
        <button @click="message = ''" class="opacity-60 hover:opacity-100">✕</button>
      </div>
    </Transition>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-2.5">
      <div
        v-for="player in filteredPlayers"
        :key="'card-' + player.id"
        class="bg-surface-800/60 border border-surface-700/60 rounded-xl p-3.5 flex flex-col gap-2.5"
      >
        <!-- Top Row: Avatar, Name, Status Badge, Score -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-lg bg-surface-700 text-surface-200 border border-surface-600 flex items-center justify-center font-bold text-sm shrink-0">
              {{ player.name ? player.name.charAt(0) : '?' }}
            </div>
            <div>
              <div class="font-bold text-sm text-white flex items-center gap-2">
                <span>{{ player.name }}</span>
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[11px] font-mono text-surface-400">
                  {{ player.player_id }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
                  :class="{
                    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30': player.status === 'active',
                    'bg-amber-500/15 text-amber-300 border border-amber-500/30': player.status === 'pending',
                    'bg-rose-500/15 text-rose-300 border border-rose-500/30': player.status === 'inactive',
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="player.status === 'active' ? 'bg-emerald-400' : player.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'" />
                  {{ statusLabels[player.status] || player.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <div class="text-[10px] text-surface-400">積分</div>
            <div class="text-base font-bold text-amber-400">
              {{ player.total_score }}
            </div>
          </div>
        </div>

        <!-- Bottom Row: Actions -->
        <div class="flex items-center justify-between pt-2 border-t border-surface-700/40 text-xs text-surface-400">
          <NuxtLink
            v-if="player.status === 'active'"
            :to="`/admin/scores?player_id=${player.id}`"
            class="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition"
          >
            + 發放積分
          </NuxtLink>
          <div v-else class="text-[11px] text-surface-400">
            {{ formatDate(player.created_at) }}
          </div>

          <div class="flex items-center gap-1.5">
            <button
              v-if="player.status === 'pending'"
              class="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition"
              @click="updateStatus(player.id, 'active')"
            >
              通過
            </button>
            <button
              v-if="player.status === 'pending'"
              class="px-3 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold hover:bg-rose-500/25 transition"
              @click="updateStatus(player.id, 'inactive')"
            >
              拒絕
            </button>
            <button
              v-if="player.status === 'active'"
              class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition"
              @click="updateStatus(player.id, 'inactive')"
            >
              停用
            </button>
            <button
              v-if="player.status === 'inactive'"
              class="px-2.5 py-1 bg-primary-500/15 text-primary-300 border border-primary-500/30 rounded-lg text-xs font-medium hover:bg-primary-500/25 transition"
              @click="updateStatus(player.id, 'active')"
            >
              啟用
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPlayers.length === 0" class="bg-surface-800/30 border border-surface-700/40 rounded-xl p-8 text-center text-surface-400">
        <p class="text-xs">找不到符合條件的玩家</p>
      </div>
    </div>

    <!-- Desktop Table View (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-surface-700/60 rounded-xl overflow-hidden backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-700/60 bg-surface-800/80 text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">玩家姓名</th>
              <th class="px-5 py-3">總積分</th>
              <th class="px-5 py-3">狀態</th>
              <th class="px-5 py-3">加入時間</th>
              <th class="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-700/40 text-xs">
            <tr
              v-for="player in filteredPlayers"
              :key="player.id"
              class="hover:bg-white/[0.02] transition-colors"
            >
              <td class="px-5 py-3 font-mono text-surface-300 font-medium">{{ player.player_id }}</td>
              <td class="px-5 py-3 font-bold text-white">{{ player.name }}</td>
              <td class="px-5 py-3 text-amber-400 font-bold">{{ player.total_score }}</td>
              <td class="px-5 py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5"
                  :class="{
                    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30': player.status === 'active',
                    'bg-amber-500/15 text-amber-300 border border-amber-500/30': player.status === 'pending',
                    'bg-rose-500/15 text-rose-300 border border-rose-500/30': player.status === 'inactive',
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="player.status === 'active' ? 'bg-emerald-400' : player.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'" />
                  {{ statusLabels[player.status] || player.status }}
                </span>
              </td>
              <td class="px-5 py-3 text-surface-400">{{ formatDate(player.created_at) }}</td>
              <td class="px-5 py-3 text-right">
                <div class="flex gap-1.5 justify-end items-center">
                  <NuxtLink
                    v-if="player.status === 'active'"
                    :to="`/admin/scores?player_id=${player.id}`"
                    class="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition"
                  >
                    + 發放積分
                  </NuxtLink>
                  <button
                    v-if="player.status === 'pending'"
                    class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition"
                    @click="updateStatus(player.id, 'active')"
                  >
                    通過
                  </button>
                  <button
                    v-if="player.status === 'pending'"
                    class="px-2.5 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold hover:bg-rose-500/25 transition"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    拒絕
                  </button>
                  <button
                    v-if="player.status === 'active'"
                    class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition"
                    @click="updateStatus(player.id, 'inactive')"
                  >
                    停用
                  </button>
                  <button
                    v-if="player.status === 'inactive'"
                    class="px-2.5 py-1 bg-primary-500/15 text-primary-300 border border-primary-500/30 rounded-lg text-xs font-medium hover:bg-primary-500/25 transition"
                    @click="updateStatus(player.id, 'active')"
                  >
                    啟用
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredPlayers.length === 0" class="text-center py-8 text-surface-400 text-xs">
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

const route = useRoute()
const { data: players, refresh } = await useFetch<Player[]>('/api/admin/players')
const activeTab = ref((route.query.tab as string) || 'all')
const searchQuery = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string
  }
})

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

