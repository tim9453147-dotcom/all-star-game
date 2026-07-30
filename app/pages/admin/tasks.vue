<template>
  <div>
    <!-- Status Message -->
    <div v-if="message" class="mb-4 p-4 rounded-xl text-sm" :class="messageType === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
      {{ message }}
    </div>

    <!-- Add Task Form -->
    <div class="bg-surface-800/50 border border-white/10 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-surface-300 mb-4">➕ 新增任務</h3>
      <form @submit.prevent="addTask" class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[180px]">
          <label class="block text-xs text-surface-400 mb-1">任務名稱</label>
          <input
            v-model="newTask.name"
            type="text"
            required
            placeholder="輸入任務名稱"
            class="w-full px-4 py-2.5 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
          />
        </div>
        <div class="w-32">
          <label class="block text-xs text-surface-400 mb-1">積分</label>
          <input
            v-model.number="newTask.points"
            type="number"
            required
            min="1"
            placeholder="積分"
            class="w-full px-4 py-2.5 bg-surface-700/50 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
          />
        </div>
        <button
          type="submit"
          class="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-semibold transition shadow-lg shadow-primary-500/20"
        >
          新增
        </button>
      </form>
    </div>

    <!-- Tasks Table -->
    <div class="bg-surface-800/50 border border-white/10 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">任務名稱</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">積分</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">狀態</th>
              <th class="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in tasks"
              :key="task.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <!-- Editing Mode -->
              <template v-if="editing === task.id">
                <td class="px-6 py-3">
                  <input v-model="editForm.name" class="w-full px-3 py-2 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">
                  <input v-model.number="editForm.points" type="number" min="1" class="w-20 px-3 py-2 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">—</td>
                <td class="px-6 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition" @click="saveEdit(task.id)">儲存</button>
                    <button class="px-3 py-1.5 bg-surface-600/50 text-surface-300 rounded-lg text-xs font-semibold hover:bg-surface-600 transition" @click="editing = null">取消</button>
                  </div>
                </td>
              </template>
              <!-- Display Mode -->
              <template v-else>
                <td class="px-6 py-4 text-sm font-semibold">{{ task.name }}</td>
                <td class="px-6 py-4 text-sm text-accent-400 font-bold">{{ task.points }}</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="task.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
                  >
                    {{ task.status === 'active' ? '啟用中' : '已停用' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-lg text-xs font-semibold hover:bg-primary-500/30 transition" @click="startEdit(task)">編輯</button>
                    <button
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      :class="task.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
                      @click="toggleStatus(task)"
                    >
                      {{ task.status === 'active' ? '停用' : '啟用' }}
                    </button>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-if="(tasks || []).length === 0" class="text-center py-12 text-surface-400">尚無任務</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Task { id: number; name: string; points: number; status: string }

const { data: tasks, refresh } = await useFetch<Task[]>('/api/admin/tasks')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editing = ref<number | null>(null)
const editForm = reactive({ name: '', points: 0 })
const newTask = reactive({ name: '', points: 1 })

function showMessage(msg: string, type: 'success' | 'error' = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function addTask() {
  try {
    await $fetch('/api/admin/tasks', { method: 'POST', body: { name: newTask.name, points: newTask.points } })
    newTask.name = ''
    newTask.points = 1
    showMessage('任務已新增！')
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '新增失敗', 'error')
  }
}

function startEdit(task: Task) {
  editing.value = task.id
  editForm.name = task.name
  editForm.points = task.points
}

async function saveEdit(id: number) {
  try {
    await $fetch(`/api/admin/tasks/${id}`, { method: 'PATCH', body: { name: editForm.name, points: editForm.points } })
    editing.value = null
    showMessage('已更新！')
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '更新失敗', 'error')
  }
}

async function toggleStatus(task: Task) {
  const newStatus = task.status === 'active' ? 'inactive' : 'active'
  try {
    await $fetch(`/api/admin/tasks/${task.id}`, { method: 'PATCH', body: { status: newStatus } })
    showMessage(`已${newStatus === 'active' ? '啟用' : '停用'}！`)
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '操作失敗', 'error')
  }
}

useHead({ title: '管理後台 - 任務管理' })
</script>
