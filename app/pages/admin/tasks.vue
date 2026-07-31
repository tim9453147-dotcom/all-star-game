<template>
  <div class="space-y-5">
    <!-- Header & Search Bar -->
    <div class="bg-surface-800/40 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>📋 任務管理</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
            共 {{ (tasks || []).length }} 個任務
          </span>
        </h2>
        <p class="text-xs text-surface-400 mt-0.5">新增賽事任務項目、編輯獲得積分與啟用狀態</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showAddModal = !showAddModal"
          class="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>➕</span>
          <span>新增任務</span>
        </button>

        <div class="relative flex-1 sm:w-60">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋任務名稱..."
            class="w-full pl-8 pr-7 py-2 bg-surface-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
          />
          <span class="absolute left-2.5 top-2.5 text-surface-400 text-xs">🔍</span>
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-2 top-2 text-surface-400 hover:text-white text-xs p-0.5">✕</button>
        </div>
      </div>
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

    <!-- Add Task Card / Form -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-4 opacity-0 scale-95"
    >
      <div v-if="showAddModal" class="bg-gradient-to-br from-surface-800/90 via-surface-800/70 to-surface-800/40 border border-primary-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-base">➕</span>
            <span>新增賽事任務</span>
          </h3>
          <button @click="showAddModal = false" class="text-surface-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-surface-700">收起 ✕</button>
        </div>

        <form @submit.prevent="addTask" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-surface-300 mb-1.5">任務名稱 *</label>
              <input
                v-model="newTask.name"
                type="text"
                required
                placeholder="例：參加大會開幕式、完成簽到..."
                class="w-full px-4 py-3 bg-surface-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-surface-300 mb-1.5">任務獲得積分 *</label>
              <div class="flex items-center">
                <button
                  type="button"
                  @click="newTask.points = Math.max(1, newTask.points - 5)"
                  class="px-3 py-3 bg-surface-700 border border-white/10 rounded-l-xl text-surface-300 hover:text-white active:scale-95 text-sm font-bold"
                >
                  -5
                </button>
                <input
                  v-model.number="newTask.points"
                  type="number"
                  required
                  min="1"
                  class="w-full py-3 bg-surface-900/80 border-y border-white/10 text-center text-sm font-bold text-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  @click="newTask.points += 5"
                  class="px-3 py-3 bg-surface-700 border border-white/10 rounded-r-xl text-surface-300 hover:text-white active:scale-95 text-sm font-bold"
                >
                  +5
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2.5 rounded-xl bg-surface-700 text-surface-300 hover:text-white text-xs font-bold transition"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-primary-500/25 active:scale-95"
            >
              確認建立任務
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="'m-task-' + task.id"
        class="bg-gradient-to-br from-surface-800/90 to-surface-800/50 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3 relative"
      >
        <!-- Display Mode -->
        <template v-if="editing !== task.id">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold text-base text-white leading-snug">{{ task.name }}</h3>
              <div class="mt-2">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  :class="task.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'"
                >
                  {{ task.status === 'active' ? '啟用中' : '已停用' }}
                </span>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 font-black text-lg shadow-inner">
                +{{ task.points }} <span class="text-xs font-normal">分</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              class="px-3.5 py-2 bg-surface-700 border border-white/10 text-surface-200 rounded-xl text-xs font-bold hover:bg-surface-600 active:scale-95 transition flex items-center gap-1"
              @click="startEdit(task)"
            >
              <span>✏️</span>
              <span>編輯</span>
            </button>
            <button
              class="px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95 transition flex items-center gap-1"
              :class="task.status === 'active'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'"
              @click="toggleStatus(task)"
            >
              <span>{{ task.status === 'active' ? '🚫 停用' : '✅ 啟用' }}</span>
            </button>
          </div>
        </template>

        <!-- Inline Mobile Edit Form -->
        <template v-else>
          <div class="space-y-3 py-1">
            <div class="text-xs font-bold text-primary-400 flex items-center gap-1">
              <span>✏️ 編輯任務 #{{ task.id }}</span>
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">任務名稱</label>
              <input
                v-model="editForm.name"
                class="w-full px-3 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1 font-medium">任務積分</label>
              <input
                v-model.number="editForm.points"
                type="number"
                min="1"
                class="w-full px-3 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
          </div>
          <div class="flex gap-2 justify-end pt-3 border-t border-white/10">
            <button
              class="px-4 py-2 bg-surface-700 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 active:scale-95 transition"
              @click="editing = null"
            >
              取消
            </button>
            <button
              class="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 active:scale-95 transition shadow-md shadow-emerald-600/20"
              @click="saveEdit(task.id)"
            >
              儲存變更
            </button>
          </div>
        </template>
      </div>

      <div v-if="filteredTasks.length === 0" class="bg-surface-800/30 border border-white/5 rounded-2xl p-8 text-center text-surface-400">
        <div class="text-3xl mb-2">📋</div>
        <p class="text-sm font-semibold">尚無符合的任務</p>
      </div>
    </div>

    <!-- Desktop Tasks Table (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10 bg-surface-800/80 text-surface-400">
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">任務名稱</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">獲得積分</th>
              <th class="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">狀態</th>
              <th class="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="hover:bg-white/5 transition-colors"
            >
              <!-- Desktop Editing Mode -->
              <template v-if="editing === task.id">
                <td class="px-6 py-3">
                  <input v-model="editForm.name" class="w-full px-3 py-2 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">
                  <input v-model.number="editForm.points" type="number" min="1" class="w-24 px-3 py-2 bg-surface-900 border border-white/10 rounded-xl text-sm text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3 text-xs text-surface-400">—</td>
                <td class="px-6 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition" @click="saveEdit(task.id)">儲存</button>
                    <button class="px-3 py-1.5 bg-surface-700 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 transition" @click="editing = null">取消</button>
                  </div>
                </td>
              </template>
              <!-- Desktop Display Mode -->
              <template v-else>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ task.name }}</td>
                <td class="px-6 py-4 text-sm text-amber-400 font-black">+{{ task.points }} 分</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="task.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="task.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'" />
                    {{ task.status === 'active' ? '啟用中' : '已停用' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-surface-700 border border-white/10 text-surface-200 rounded-xl text-xs font-semibold hover:bg-surface-600 transition" @click="startEdit(task)">編輯</button>
                    <button
                      class="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                      :class="task.status === 'active' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'"
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
        <div v-if="filteredTasks.length === 0" class="text-center py-12 text-surface-400 text-sm">尚無任務</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Task { id: number; name: string; points: number; status: string }

const { data: tasks, refresh } = await useFetch<Task[]>('/api/admin/tasks')
const searchQuery = ref('')
const showAddModal = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editing = ref<number | null>(null)
const editForm = reactive({ name: '', points: 0 })
const newTask = reactive({ name: '', points: 10 })

const filteredTasks = computed(() => {
  const all = tasks.value || []
  if (!searchQuery.value.trim()) return all
  const q = searchQuery.value.toLowerCase().trim()
  return all.filter(t => t.name && t.name.toLowerCase().includes(q))
})

function showMessage(msg: string, type: 'success' | 'error' = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function addTask() {
  try {
    await $fetch('/api/admin/tasks', { method: 'POST', body: { name: newTask.name, points: newTask.points } })
    newTask.name = ''
    newTask.points = 10
    showAddModal.value = false
    showMessage('任務已成功新增！')
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
    showMessage('任務已成功更新！')
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '更新失敗', 'error')
  }
}

async function toggleStatus(task: Task) {
  const newStatus = task.status === 'active' ? 'inactive' : 'active'
  try {
    await $fetch(`/api/admin/tasks/${task.id}`, { method: 'PATCH', body: { status: newStatus } })
    showMessage(`任務已${newStatus === 'active' ? '啟用' : '停用'}！`)
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '操作失敗', 'error')
  }
}

useHead({ title: '管理後台 - 任務管理' })
</script>
