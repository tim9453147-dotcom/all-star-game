<template>
  <div class="space-y-4">
    <!-- Header & Action Bar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface-800/40 border border-surface-700/60 rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <h2 class="text-base sm:text-lg font-bold text-white tracking-wide">任務管理</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-300 border border-surface-600 font-mono font-medium">
          {{ (tasks || []).length }} 個
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showAddModal = !showAddModal"
          class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 flex items-center gap-1 shrink-0"
        >
          <span>+ 新增任務</span>
        </button>

        <div class="relative flex-1 sm:w-56">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋任務..."
            class="w-full pl-8 pr-7 py-1.5 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 transition"
          />
          <span class="absolute left-2.5 top-2 text-surface-400 text-xs">🔍</span>
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-2 top-2 text-surface-400 hover:text-white text-xs">✕</button>
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
        class="p-3 rounded-lg text-xs font-medium flex items-center justify-between shadow-md"
        :class="messageType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'"
      >
        <span>{{ message }}</span>
        <button @click="message = ''" class="opacity-60 hover:opacity-100">✕</button>
      </div>
    </Transition>

    <!-- Add Task Card / Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0 scale-98"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-2 opacity-0 scale-98"
    >
      <div v-if="showAddModal" class="bg-surface-800/80 border border-surface-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md">
        <div class="flex items-center justify-between mb-3 border-b border-surface-700/60 pb-2">
          <h3 class="text-xs sm:text-sm font-bold text-white">新增賽事任務</h3>
          <button @click="showAddModal = false" class="text-surface-400 hover:text-white text-xs px-2 py-0.5 rounded bg-surface-700">✕</button>
        </div>

        <form @submit.prevent="addTask" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-medium text-surface-400 mb-1">任務名稱 *</label>
              <input
                v-model="newTask.name"
                type="text"
                required
                placeholder="例如：完成簽到關卡..."
                class="w-full px-3 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label class="block text-[11px] font-medium text-surface-400 mb-1">獲得積分 *</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model.number="newTask.points"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 bg-surface-900/90 border border-surface-700 rounded-lg text-xs sm:text-sm text-amber-400 font-bold text-center focus:outline-none focus:border-primary-500 transition"
                />
                <div class="flex gap-1 shrink-0">
                  <button
                    v-for="preset in [5, 10, 20]"
                    :key="'preset-' + preset"
                    type="button"
                    @click="newTask.points = preset"
                    class="px-2 py-1 rounded text-[11px] font-medium transition"
                    :class="newTask.points === preset ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-surface-700/80 text-surface-400 hover:text-white'"
                  >
                    {{ preset }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-3 py-1.5 rounded-lg bg-surface-700 text-surface-300 hover:text-white text-xs font-medium transition"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold transition active:scale-95"
            >
              建立任務
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-2.5">
      <div
        v-for="task in filteredTasks"
        :key="'m-task-' + task.id"
        class="bg-surface-800/60 border border-surface-700/60 rounded-xl p-3.5 flex flex-col gap-2.5"
      >
        <!-- Display Mode -->
        <template v-if="editing !== task.id">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold text-sm text-white leading-snug">{{ task.name }}</h3>
              <div class="mt-1">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium inline-flex items-center gap-1"
                  :class="task.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="task.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'" />
                  {{ task.status === 'active' ? '啟用中' : '已停用' }}
                </span>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="text-sm font-bold text-amber-400">
                +{{ task.points }} 分
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-1.5 pt-2 border-t border-surface-700/40">
            <button
              class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition"
              @click="startEdit(task)"
            >
              編輯
            </button>
            <button
              class="px-2.5 py-1 rounded-lg text-xs font-medium transition"
              :class="task.status === 'active'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'"
              @click="toggleStatus(task)"
            >
              {{ task.status === 'active' ? '停用' : '啟用' }}
            </button>
          </div>
        </template>

        <!-- Inline Mobile Edit Form -->
        <template v-else>
          <div class="space-y-2 py-1">
            <div>
              <label class="block text-[11px] text-surface-400 mb-1">任務名稱</label>
              <input
                v-model="editForm.name"
                class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1">任務積分</label>
              <input
                v-model.number="editForm.points"
                type="number"
                min="1"
                class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-amber-400 font-bold focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <div class="flex gap-1.5 justify-end pt-2 border-t border-surface-700/40">
            <button
              class="px-3 py-1 bg-surface-700 text-surface-300 rounded-lg text-xs font-medium hover:bg-surface-600 transition"
              @click="editing = null"
            >
              取消
            </button>
            <button
              class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition"
              @click="saveEdit(task.id)"
            >
              儲存
            </button>
          </div>
        </template>
      </div>

      <div v-if="filteredTasks.length === 0" class="bg-surface-800/30 border border-surface-700/40 rounded-xl p-8 text-center text-surface-400">
        <p class="text-xs">尚無符合條件的任務</p>
      </div>
    </div>

    <!-- Desktop Tasks Table (>= md) -->
    <div class="hidden md:block bg-surface-800/40 border border-surface-700/60 rounded-xl overflow-hidden backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-700/60 bg-surface-800/80 text-surface-400 text-xs font-semibold uppercase tracking-wider">
              <th class="px-5 py-3">任務名稱</th>
              <th class="px-5 py-3">獲得積分</th>
              <th class="px-5 py-3">狀態</th>
              <th class="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-700/40 text-xs">
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="hover:bg-white/[0.02] transition-colors"
            >
              <!-- Desktop Editing Mode -->
              <template v-if="editing === task.id">
                <td class="px-5 py-2.5">
                  <input v-model="editForm.name" class="w-full px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-white focus:outline-none focus:border-primary-500" />
                </td>
                <td class="px-5 py-2.5">
                  <input v-model.number="editForm.points" type="number" min="1" class="w-20 px-3 py-1.5 bg-surface-900 border border-surface-700 rounded-lg text-xs text-amber-400 font-bold focus:outline-none focus:border-primary-500" />
                </td>
                <td class="px-5 py-2.5 text-surface-400">—</td>
                <td class="px-5 py-2.5 text-right">
                  <div class="flex gap-1.5 justify-end">
                    <button class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition" @click="saveEdit(task.id)">儲存</button>
                    <button class="px-2.5 py-1 bg-surface-700 text-surface-300 rounded-lg text-xs font-medium hover:bg-surface-600 transition" @click="editing = null">取消</button>
                  </div>
                </td>
              </template>
              <!-- Desktop Display Mode -->
              <template v-else>
                <td class="px-5 py-3 font-bold text-white">{{ task.name }}</td>
                <td class="px-5 py-3 text-amber-400 font-bold">+{{ task.points }} 分</td>
                <td class="px-5 py-3">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5 cursor-pointer select-none"
                    :class="task.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'"
                    @click="toggleStatus(task)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="task.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'" />
                    {{ task.status === 'active' ? '啟用中' : '已停用' }}
                  </span>
                </td>
                <td class="px-5 py-3 text-right">
                  <div class="flex gap-1.5 justify-end">
                    <button class="px-2.5 py-1 bg-surface-700 text-surface-300 border border-surface-600 rounded-lg text-xs font-medium hover:bg-surface-600 transition" @click="startEdit(task)">編輯</button>
                    <button
                      class="px-2.5 py-1 rounded-lg text-xs font-medium transition"
                      :class="task.status === 'active' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'"
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
        <div v-if="filteredTasks.length === 0" class="text-center py-8 text-surface-400 text-xs">尚無任務</div>
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

