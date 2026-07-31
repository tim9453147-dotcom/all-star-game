<template>
  <div class="space-y-5">
    <!-- Header & Top Summary -->
    <div class="bg-surface-800/40 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>⭐ 積分管理</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
            共 {{ (records || []).length }} 筆紀錄
          </span>
        </h2>
        <p class="text-xs text-surface-400 mt-0.5">發放特定任務積分給玩家、瀏覽並編輯發放歷史</p>
      </div>

      <button
        @click="showForm = !showForm"
        class="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-surface-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 shrink-0"
      >
        <span>⭐</span>
        <span>{{ showForm ? '隱藏發放表單' : '新增發放積分' }}</span>
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

    <!-- Add Score Form -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-4 opacity-0 scale-95"
    >
      <div v-if="showForm" class="bg-gradient-to-br from-surface-800/90 via-surface-800/70 to-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <h3 class="text-sm sm:text-base font-bold text-amber-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <span class="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-base">⭐</span>
          <span>手動發放積分給玩家</span>
        </h3>

        <form @submit.prevent="addScore" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Player Select -->
            <div>
              <label class="block text-xs text-surface-300 mb-1.5 font-bold">1. 選擇玩家 *</label>
              <div class="relative">
                <select
                  v-model.number="scoreForm.player_id"
                  required
                  class="w-full px-4 py-3 bg-surface-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>請選擇要給予積分的玩家 ({{ activePlayers.length }} 位)</option>
                  <option v-for="p in activePlayers" :key="p.id" :value="p.id" class="bg-surface-800 text-white">
                    👤 {{ p.name }} (ID: {{ p.player_id }}) — 目前 {{ p.total_score }} 分
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
                  ▼
                </div>
              </div>
            </div>

            <!-- Task Select -->
            <div>
              <label class="block text-xs text-surface-300 mb-1.5 font-bold">2. 選擇完成之任務 *</label>
              <div class="relative">
                <select
                  v-model.number="scoreForm.task_id"
                  required
                  class="w-full px-4 py-3 bg-surface-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>請選擇要發放的任務 ({{ activeTasks.length }} 個)</option>
                  <option v-for="t in activeTasks" :key="t.id" :value="t.id" class="bg-surface-800 text-white">
                    📋 {{ t.name }} (+{{ t.points }}分)
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div class="flex-1">
              <label class="block text-xs text-surface-300 mb-1.5 font-medium">3. 備註欄位（選填）</label>
              <input
                v-model="scoreForm.note"
                type="text"
                placeholder="例如：現場關卡闖關完成、提早報到獎勵..."
                class="w-full px-4 py-3 bg-surface-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              />
            </div>

            <div class="flex items-center justify-between sm:justify-start gap-4">
              <div class="shrink-0 text-center px-4 py-2 rounded-xl bg-surface-900/90 border border-white/10 min-w-[100px]">
                <div class="text-[10px] text-surface-400 font-medium">將獲得積分</div>
                <div class="text-xl font-black text-amber-400">
                  {{ selectedTaskPoints > 0 ? '+' + selectedTaskPoints + ' 分' : '—' }}
                </div>
              </div>
              <button
                type="submit"
                :disabled="!scoreForm.player_id || !scoreForm.task_id"
                class="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-surface-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                確認新增積分
              </button>
            </div>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Filter & Search Bar for Records -->
    <div class="bg-surface-800/40 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-1">
        <label class="text-xs text-surface-400 shrink-0 font-medium">篩選玩家：</label>
        <div class="relative flex-1 sm:max-w-xs">
          <select
            v-model="filterPlayerId"
            class="w-full px-3 py-2 bg-surface-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition appearance-none cursor-pointer"
          >
            <option value="">全部玩家紀錄</option>
            <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{ p.name }} ({{ p.player_id }})</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-400 text-xs">▼</div>
        </div>
      </div>

      <div class="relative flex-1 sm:max-w-xs">
        <input
          v-model="searchRecordQuery"
          type="text"
          placeholder="搜尋關鍵字 (任務 / 備註 / 玩家)..."
          class="w-full pl-8 pr-7 py-2 bg-surface-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
        />
        <span class="absolute left-2.5 top-2.5 text-surface-400 text-xs">🔍</span>
        <button v-if="searchRecordQuery" @click="searchRecordQuery = ''" class="absolute right-2 top-2 text-surface-400 hover:text-white text-xs p-0.5">✕</button>
      </div>
    </div>

    <!-- Mobile Score Records Cards (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="record in filteredRecords"
        :key="'m-rec-' + record.id"
        class="bg-gradient-to-br from-surface-800/90 to-surface-800/50 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3 relative"
      >
        <template v-if="editingRecord !== record.id">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                {{ record.player_name ? record.player_name.charAt(0) : '?' }}
              </div>
              <div>
                <div class="font-bold text-base text-white leading-tight">{{ record.player_name }}</div>
                <div class="text-xs text-amber-300 font-medium mt-0.5">{{ record.task_name }}</div>
              </div>
            </div>

            <div class="text-right shrink-0">
              <span class="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-black text-lg shadow-inner">
                +{{ record.points }} <span class="text-xs font-normal">分</span>
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-white/10">
            <span class="truncate max-w-[180px] italic text-surface-300">{{ record.note || '無備註' }}</span>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-surface-500">{{ formatDate(record.created_at) }}</span>
              <button
                class="px-3 py-1.5 bg-surface-700 border border-white/10 text-surface-200 rounded-xl text-xs font-bold hover:bg-surface-600 active:scale-95 transition"
                @click="startRecordEdit(record)"
              >
                ✏️ 編輯
              </button>
            </div>
          </div>
        </template>

        <!-- Inline Edit for Mobile -->
        <template v-else>
          <div class="space-y-3 py-1">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <span class="font-bold text-sm text-white">✏️ 編輯紀錄 #{{ record.id }} — {{ record.player_name }}</span>
              <span class="text-[11px] text-surface-400">{{ formatDate(record.created_at) }}</span>
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">調整積分</label>
              <input
                v-model.number="editRecordForm.points"
                type="number"
                min="1"
                class="w-full px-3 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm font-bold text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">修改備註</label>
              <input
                v-model="editRecordForm.note"
                class="w-full px-3 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
          <div class="flex gap-2 justify-end pt-3 border-t border-white/10">
            <button
              class="px-4 py-2 bg-surface-700 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 active:scale-95 transition"
              @click="editingRecord = null"
            >
              取消
            </button>
            <button
              class="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 active:scale-95 transition shadow-md shadow-emerald-600/20"
              @click="saveRecordEdit(record.id)"
            >
              儲存變更
            </button>
          </div>
        </template>
      </div>

      <div v-if="filteredRecords.length === 0" class="bg-surface-800/30 border border-white/5 rounded-2xl p-8 text-center text-surface-400">
        <div class="text-3xl mb-2">⭐</div>
        <p class="text-sm font-semibold">尚無符合的積分發放紀錄</p>
      </div>
    </div>

    <!-- Desktop Score Records Table (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10 bg-surface-800/80 text-surface-400">
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">發放日期</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">獲獎玩家</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">完成任務</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">獲得積分</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">備註資訊</th>
              <th class="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="hover:bg-white/5 transition-colors"
            >
              <template v-if="editingRecord === record.id">
                <td class="px-6 py-3 text-xs text-surface-400">{{ formatDate(record.created_at) }}</td>
                <td class="px-6 py-3 text-sm font-bold text-white">{{ record.player_name }}</td>
                <td class="px-6 py-3 text-sm text-surface-300">{{ record.task_name }}</td>
                <td class="px-6 py-3">
                  <input v-model.number="editRecordForm.points" type="number" min="1" class="w-24 px-3 py-1.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                </td>
                <td class="px-6 py-3">
                  <input v-model="editRecordForm.note" class="w-full px-3 py-1.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                </td>
                <td class="px-6 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition" @click="saveRecordEdit(record.id)">儲存</button>
                    <button class="px-3 py-1.5 bg-surface-700 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 transition" @click="editingRecord = null">取消</button>
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="px-6 py-4 text-xs text-surface-400 font-mono">{{ formatDate(record.created_at) }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ record.player_name }}</td>
                <td class="px-6 py-4 text-sm text-surface-300 font-medium">{{ record.task_name }}</td>
                <td class="px-6 py-4 text-sm text-amber-400 font-black">+{{ record.points }} 分</td>
                <td class="px-6 py-4 text-xs text-surface-400 italic">{{ record.note || '—' }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="px-3 py-1.5 bg-surface-700 border border-white/10 text-surface-200 rounded-xl text-xs font-semibold hover:bg-surface-600 transition" @click="startRecordEdit(record)">編輯</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredRecords.length === 0" class="text-center py-12 text-surface-400 text-sm">尚無積分紀錄</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Player { id: number; player_id: string; name: string; total_score: number; status: string }
interface Task { id: number; name: string; points: number; status: string }
interface ScoreRecord { id: number; player_id: number; task_id: number; points: number; note: string; created_at: string; player_name: string; task_name: string }

const { data: allPlayers } = await useFetch<Player[]>('/api/admin/players')
const { data: allTasks } = await useFetch<Task[]>('/api/admin/tasks')

const activePlayers = computed(() => (allPlayers.value || []).filter(p => p.status === 'active'))
const activeTasks = computed(() => (allTasks.value || []).filter(t => t.status === 'active'))

const filterPlayerId = ref('')
const searchRecordQuery = ref('')
const showForm = ref(true)

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
    (r.player_name && r.player_name.toLowerCase().includes(q)) ||
    (r.task_name && r.task_name.toLowerCase().includes(q)) ||
    (r.note && r.note.toLowerCase().includes(q))
  )
})

const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editingRecord = ref<number | null>(null)
const editRecordForm = reactive({ points: 0, note: '' })

const scoreForm = reactive({ player_id: '' as any, task_id: '' as any, note: '' })
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
