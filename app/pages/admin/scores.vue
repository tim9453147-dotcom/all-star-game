<template>
  <div>
    <!-- Status Message -->
    <div v-if="message" class="mb-4 p-4 rounded-xl text-sm" :class="messageType === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
      {{ message }}
    </div>

    <!-- Add Score Form -->
    <div class="bg-surface-800/50 border border-accent-500/20 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-accent-300 mb-4">⭐ 新增積分</h3>
      <form @submit.prevent="addScore" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Player Select -->
          <div>
            <label class="block text-xs text-surface-400 mb-1">選擇玩家</label>
            <select
              v-model.number="scoreForm.player_id"
              required
              class="w-full px-4 py-2.5 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition appearance-none"
            >
              <option value="" disabled>請選擇玩家</option>
              <option v-for="p in activePlayers" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.player_id }}) — {{ p.total_score }}分
              </option>
            </select>
          </div>
          <!-- Task Select -->
          <div>
            <label class="block text-xs text-surface-400 mb-1">選擇任務</label>
            <select
              v-model.number="scoreForm.task_id"
              required
              class="w-full px-4 py-2.5 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition appearance-none"
            >
              <option value="" disabled>請選擇任務</option>
              <option v-for="t in activeTasks" :key="t.id" :value="t.id">
                {{ t.name }} (+{{ t.points }}分)
              </option>
            </select>
          </div>
        </div>
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-xs text-surface-400 mb-1">備註（選填）</label>
            <input
              v-model="scoreForm.note"
              type="text"
              placeholder="備註資訊"
              class="w-full px-4 py-2.5 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
            />
          </div>
          <div class="shrink-0 text-center">
            <div class="text-xs text-surface-400 mb-1">積分</div>
            <div class="text-2xl font-black text-accent-400 w-16">
              {{ selectedTaskPoints > 0 ? '+' + selectedTaskPoints : '—' }}
            </div>
          </div>
          <button
            type="submit"
            :disabled="!scoreForm.player_id || !scoreForm.task_id"
            class="px-8 py-2.5 bg-accent-600 hover:bg-accent-500 rounded-xl text-sm font-bold transition shadow-lg shadow-accent-500/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            新增積分
          </button>
        </div>
      </form>
    </div>

    <!-- Filter -->
    <div class="mb-4 flex gap-3 items-center">
      <label class="text-sm text-surface-400">篩選玩家：</label>
      <select
        v-model="filterPlayerId"
        class="px-4 py-2 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition appearance-none"
      >
        <option value="">全部</option>
        <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
    </div>

    <!-- Score Records Table -->
    <div class="bg-surface-800/50 border border-white/10 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">日期</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">玩家</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">任務</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">積分</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">備註</th>
              <th class="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in records"
              :key="record.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <template v-if="editingRecord === record.id">
                <td class="px-6 py-3 text-sm text-surface-400">{{ formatDate(record.created_at) }}</td>
                <td class="px-6 py-3 text-sm">{{ record.player_name }}</td>
                <td class="px-6 py-3 text-sm">{{ record.task_name }}</td>
                <td class="px-6 py-3">
                  <input v-model.number="editRecordForm.points" type="number" min="1" class="w-20 px-3 py-1.5 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">
                  <input v-model="editRecordForm.note" class="w-full px-3 py-1.5 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition" @click="saveRecordEdit(record.id)">儲存</button>
                    <button class="px-3 py-1.5 bg-surface-600/50 text-surface-300 rounded-lg text-xs font-semibold hover:bg-surface-600 transition" @click="editingRecord = null">取消</button>
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="px-6 py-4 text-sm text-surface-400">{{ formatDate(record.created_at) }}</td>
                <td class="px-6 py-4 text-sm font-semibold">{{ record.player_name }}</td>
                <td class="px-6 py-4 text-sm">{{ record.task_name }}</td>
                <td class="px-6 py-4 text-sm text-accent-400 font-bold">+{{ record.points }}</td>
                <td class="px-6 py-4 text-sm text-surface-400">{{ record.note || '—' }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-lg text-xs font-semibold hover:bg-primary-500/30 transition" @click="startRecordEdit(record)">編輯</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-if="(records || []).length === 0" class="text-center py-12 text-surface-400">尚無積分紀錄</div>
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
const scoreRecordsUrl = computed(() => {
  const base = '/api/admin/scores'
  return filterPlayerId.value ? `${base}?player_id=${filterPlayerId.value}` : base
})
const { data: records, refresh: refreshRecords } = await useFetch<ScoreRecord[]>(scoreRecordsUrl)

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
    showMessage('積分已新增！')
    await refreshRecords()
    // Also refresh players to get updated scores
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
    showMessage('已更新！')
    await refreshRecords()
  } catch (e: any) {
    showMessage(e.data?.message || '更新失敗', 'error')
  }
}

useHead({ title: '管理後台 - 積分管理' })
</script>
