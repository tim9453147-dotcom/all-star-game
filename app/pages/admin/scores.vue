<template>
  <div class="space-y-4">
    <!-- Header & Action Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface-800/40 border border-surface-700/60 rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <h2 class="text-base sm:text-lg font-bold text-white tracking-wide">積分管理</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-300 border border-surface-600 font-mono font-medium">
          {{ (records || []).length }} 筆
        </span>
      </div>

      <button
        @click="showForm = !showForm"
        class="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 rounded-lg text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1 shrink-0"
      >
        <span>{{ showForm ? '隱藏表單' : '+ 發放積分' }}</span>
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

    <!-- Add Score Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0 scale-98"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-2 opacity-0 scale-98"
    >
      <div v-if="showForm" class="bg-surface-800/80 border border-surface-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md">
        <form @submit.prevent="addScore" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Player Select -->
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">選擇玩家 *</label>
              <div class="relative">
                <select
                  v-model.number="scoreForm.player_id"
                  required
                  class="w-full px-3 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>請選擇玩家</option>
                  <option v-for="p in activePlayers" :key="p.id" :value="p.id" class="bg-surface-800 text-white">
                    {{ p.player_id }} ({{ p.name }}) — {{ p.total_score }} 分
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-surface-400 text-xs">▼</div>
              </div>
            </div>

            <!-- Task Select -->
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">選擇任務 *</label>
              <div class="relative">
                <select
                  v-model.number="scoreForm.task_id"
                  required
                  class="w-full px-3 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>請選擇任務</option>
                  <option v-for="t in activeTasks" :key="t.id" :value="t.id" class="bg-surface-800 text-white">
                    {{ t.name }} (+{{ t.points }}分)
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-surface-400 text-xs">▼</div>
              </div>
            </div>

            <!-- Note Input -->
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">備註（選填）</label>
              <input
                v-model="scoreForm.note"
                type="text"
                placeholder="例如：現場關卡完成..."
                class="w-full px-3 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-1">
            <span v-if="selectedTaskPoints > 0" class="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">+{{ selectedTaskPoints }} 分</span>
            <button
              type="submit"
              :disabled="!scoreForm.player_id || !scoreForm.task_id"
              class="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-surface-950 font-bold rounded-lg text-xs transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
            >
              確認發放
            </button>
          </div>
        </form>
      </div>
    </Transition>
    <div class="bg-surface-800/40 border border-surface-700/60 rounded-xl p-3 sm:p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <!-- Player Select Filter -->
        <div class="relative flex-1 sm:max-w-xs">
          <select
            v-model="filterPlayerId"
            class="w-full pl-3 pr-8 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition appearance-none cursor-pointer"
          >
            <option value="">全部玩家</option>
            <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{ p.player_id }} ({{ p.name }})</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-surface-400 text-xs">▼</div>
        </div>

        <!-- Search Input -->
        <div class="relative flex-1 sm:max-w-xs">
          <input
            v-model="searchRecordQuery"
            type="text"
            placeholder="搜尋紀錄 (玩家/任務/備註)..."
            class="w-full pl-8 pr-7 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs text-white placeholder-surface-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
          />
          <span class="absolute left-2.5 top-2.5 text-surface-400 text-xs">🔍</span>
          <button v-if="searchRecordQuery" @click="searchRecordQuery = ''" class="absolute right-2.5 top-2.5 text-surface-400 hover:text-white text-xs">✕</button>
        </div>

        <!-- Filter Reset & Result Counter -->
        <div v-if="filterPlayerId || searchRecordQuery" class="flex items-center gap-2 shrink-0">
          <button
            @click="filterPlayerId = ''; searchRecordQuery = ''"
            class="px-3 py-1.5 bg-surface-700/80 hover:bg-surface-700 text-surface-300 rounded-lg text-xs font-medium border border-surface-600 transition flex items-center gap-1 active:scale-95"
          >
            <span>✕</span>
            <span>重置篩選</span>
          </button>
          <span class="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold">
            {{ filteredRecords.length }} / {{ (records || []).length }} 筆
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Score Records Cards (< md) -->
    <div class="md:hidden space-y-2.5">
      <div
        v-for="record in filteredRecords"
        :key="'m-rec-' + record.id"
        class="bg-surface-800/60 border border-surface-700/60 rounded-xl p-3.5 flex flex-col gap-2.5"
      >
        <template v-if="editingRecord !== record.id">
          <div class="flex items-start justify-between gap-3">
            <!-- Player Avatar & Info Chip -->
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                {{ (record.player_game_id || record.player_name || '?').charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-sm text-white leading-tight font-mono">
                  {{ record.player_game_id || record.player_name }}
                </div>
                <div v-if="record.player_game_id && record.player_name" class="text-xs text-surface-400 font-normal">
                  {{ record.player_name }}
                </div>
                <div class="text-xs text-amber-300/90 font-medium mt-0.5">{{ record.task_name }}</div>
              </div>
            </div>

            <!-- Score Badge -->
            <div class="text-right shrink-0">
              <span class="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold font-mono text-xs">
                +{{ record.points }} 分
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-surface-400 pt-2 border-t border-surface-700/40">
            <span class="truncate max-w-[180px] text-surface-400">
              <template v-if="record.note && record.note.trim()">{{ record.note }}</template>
              <template v-else><span class="text-surface-600 font-mono">—</span></template>
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-surface-400 font-mono">{{ formatDate(record.created_at) }}</span>
              <button
                class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition active:scale-95"
                @click="startRecordEdit(record)"
              >
                編輯
              </button>
            </div>
          </div>
        </template>

        <!-- Inline Edit for Mobile -->
        <template v-else>
          <div class="space-y-2 py-1">
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">調整積分</label>
              <input
                v-model.number="editRecordForm.points"
                type="number"
                min="1"
                class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs font-bold font-mono text-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
              />
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">修改備註</label>
              <input
                v-model="editRecordForm.note"
                type="text"
                placeholder="備註..."
                class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
              />
            </div>
          </div>
          <div class="flex gap-2 justify-end pt-2 border-t border-surface-700/40">
            <button
              class="px-3 py-1.5 bg-surface-700/80 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-700 transition active:scale-95"
              @click="editingRecord = null"
            >
              取消
            </button>
            <button
              class="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition active:scale-95"
              @click="saveRecordEdit(record.id)"
            >
              儲存
            </button>
          </div>
        </template>
      </div>

      <!-- Mobile Empty State -->
      <div v-if="filteredRecords.length === 0" class="bg-surface-800/30 border border-surface-700/40 rounded-xl p-8 text-center text-surface-400 flex flex-col items-center justify-center gap-2">
        <span class="text-2xl opacity-60">📜</span>
        <p class="text-xs font-medium text-surface-300">無符合條件的積分紀錄</p>
      </div>
    </div>

    <!-- Desktop Score Records Table (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-surface-700/60 rounded-xl overflow-hidden backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-700/60 bg-surface-800/80 text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th class="px-5 py-3">日期</th>
              <th class="px-5 py-3">玩家</th>
              <th class="px-5 py-3">任務</th>
              <th class="px-5 py-3">積分</th>
              <th class="px-5 py-3">備註</th>
              <th class="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-700/40 text-xs">
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="hover:bg-white/[0.02] transition-colors"
            >
              <template v-if="editingRecord === record.id">
                <td class="px-5 py-3 text-xs text-surface-400 font-mono">{{ formatDate(record.created_at) }}</td>
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      {{ (record.player_game_id || record.player_name || '?').charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-bold text-white font-mono">{{ record.player_game_id || record.player_name }}</span>
                  </div>
                </td>
                <td class="px-5 py-3 text-surface-300 font-medium">{{ record.task_name }}</td>
                <td class="px-5 py-3">
                  <input
                    v-model.number="editRecordForm.points"
                    type="number"
                    min="1"
                    class="w-24 px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-amber-300 font-bold font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                  />
                </td>
                <td class="px-5 py-3">
                  <input
                    v-model="editRecordForm.note"
                    type="text"
                    placeholder="備註..."
                    class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                  />
                </td>
                <td class="px-5 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button
                      class="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition active:scale-95"
                      @click="saveRecordEdit(record.id)"
                    >
                      儲存
                    </button>
                    <button
                      class="px-3 py-1.5 bg-surface-700/80 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-700 transition active:scale-95"
                      @click="editingRecord = null"
                    >
                      取消
                    </button>
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="px-5 py-3.5 text-xs text-surface-400 font-mono">{{ formatDate(record.created_at) }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      {{ (record.player_game_id || record.player_name || '?').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <span class="font-bold text-white font-mono">{{ record.player_game_id || record.player_name }}</span>
                      <span v-if="record.player_game_id && record.player_name" class="text-xs text-surface-400 font-normal ml-1 border-l border-surface-700 pl-1">
                        {{ record.player_name }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-surface-300 font-medium">{{ record.task_name }}</td>
                <td class="px-5 py-3.5">
                  <span class="inline-block bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold font-mono text-xs">
                    +{{ record.points }} 分
                  </span>
                </td>
                <td class="px-5 py-3.5 text-surface-400">
                  <template v-if="record.note && record.note.trim()">{{ record.note }}</template>
                  <template v-else><span class="text-surface-600 font-mono">—</span></template>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button
                    class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition active:scale-95"
                    @click="startRecordEdit(record)"
                  >
                    編輯
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>

        <!-- Desktop Empty State -->
        <div v-if="filteredRecords.length === 0" class="text-center py-12 text-surface-400 text-xs flex flex-col items-center justify-center gap-2">
          <span class="text-3xl opacity-60">📜</span>
          <p class="font-medium text-surface-300">無符合條件的積分紀錄</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Player { id: number; player_id: string; name: string; total_score: number; status: string }
interface Task { id: number; name: string; points: number; status: string }
interface ScoreRecord { id: number; player_id: number; task_id: number; points: number; note: string; created_at: string; player_name: string; player_game_id?: string; task_name: string }

const route = useRoute()
const { data: allPlayers } = await useFetch<Player[]>('/api/admin/players')
const { data: allTasks } = await useFetch<Task[]>('/api/admin/tasks')

const activePlayers = computed(() => (allPlayers.value || []).filter(p => p.status === 'active'))
const activeTasks = computed(() => (allTasks.value || []).filter(t => t.status === 'active'))

const filterPlayerId = ref('')
const searchRecordQuery = ref('')
const showForm = ref(true)

const scoreForm = reactive({ player_id: '' as any, task_id: '' as any, note: '' })

// Handle player_id query param from navigation
if (route.query.player_id) {
  const targetId = Number(route.query.player_id)
  if (targetId) {
    scoreForm.player_id = targetId
    showForm.value = true
  }
}

const scoreRecordsUrl = computed(() => {
  const base = '/api/admin/scores'
  return filterPlayerId.value ? `${base}?player_id=${filterPlayerId.value}` : base
})
const { data: records, refresh: refreshRecords } = await useFetch<ScoreRecord[]>(scoreRecordsUrl)

const filteredRecords = computed(() => {
  const all = records.value || []
  if (!searchRecordQuery.value.trim()) return all
  const q = searchRecordQuery.value.toLowerCase().trim()
  return all.filter(r =>
    (r.player_game_id && r.player_game_id.toLowerCase().includes(q)) ||
    (r.player_name && r.player_name.toLowerCase().includes(q)) ||
    (r.task_name && r.task_name.toLowerCase().includes(q)) ||
    (r.note && r.note.toLowerCase().includes(q))
  )
})

const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editingRecord = ref<number | null>(null)
const editRecordForm = reactive({ points: 0, note: '' })

const selectedTaskPoints = computed(() => {
  const task = activeTasks.value.find(t => t.id === scoreForm.task_id)
  return task ? task.points : 0
})

function showMessage(msg: string, type: 'success' | 'error' = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d + 'Z').toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function addScore() {
  try {
    await $fetch('/api/admin/scores', {
      method: 'POST',
      body: { player_id: scoreForm.player_id, task_id: scoreForm.task_id, note: scoreForm.note || undefined },
    })
    scoreForm.player_id = ''
    scoreForm.task_id = ''
    scoreForm.note = ''
    showMessage('積分已成功新增並發放！')
    await refreshRecords()
    const { data: updatedPlayers } = await useFetch<Player[]>('/api/admin/players')
    allPlayers.value = updatedPlayers.value
  } catch (e: any) {
    showMessage(e.data?.message || '新增失敗', 'error')
  }
}

function startRecordEdit(record: ScoreRecord) {
  editingRecord.value = record.id
  editRecordForm.points = record.points
  editRecordForm.note = record.note || ''
}

async function saveRecordEdit(id: number) {
  try {
    await $fetch(`/api/admin/scores/${id}`, { method: 'PATCH', body: { points: editRecordForm.points, note: editRecordForm.note } })
    editingRecord.value = null
    showMessage('紀錄已成功更新！')
    await refreshRecords()
  } catch (e: any) {
    showMessage(e.data?.message || '更新失敗', 'error')
  }
}

useHead({ title: '管理後台 - 積分管理' })
</script>

