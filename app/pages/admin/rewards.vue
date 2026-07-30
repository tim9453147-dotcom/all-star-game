<template>
  <div>
    <!-- Status Message -->
    <div v-if="message" class="mb-4 p-4 rounded-xl text-xs sm:text-sm font-semibold" :class="messageType === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'">
      {{ message }}
    </div>

    <!-- Add Reward Form -->
    <div class="bg-surface-800/50 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
      <h3 class="text-sm font-bold text-surface-300 mb-4 flex items-center gap-1.5">🎁 新增獎勵</h3>
      <form @submit.prevent="addReward" class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div class="w-full sm:w-36">
          <label class="block text-xs text-surface-400 mb-1 font-medium">積分門檻</label>
          <input
            v-model.number="newReward.points_required"
            type="number"
            required
            min="1"
            placeholder="門檻"
            class="w-full px-4 py-3 bg-surface-700/50 border border-white/10 rounded-xl text-base sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs text-surface-400 mb-1 font-medium">獎勵名稱</label>
          <input
            v-model="newReward.name"
            type="text"
            required
            placeholder="輸入獎勵名稱"
            class="w-full px-4 py-3 bg-surface-700/50 border border-white/10 rounded-xl text-base sm:text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
          />
        </div>
        <button
          type="submit"
          class="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold transition shadow-lg shadow-primary-500/20 active:scale-95 shrink-0"
        >
          新增獎勵
        </button>
      </form>
    </div>

    <!-- Mobile Card View (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="reward in rewards"
        :key="'m-reward-' + reward.id"
        class="bg-surface-800/60 border border-white/10 rounded-2xl p-4 shadow-md flex flex-col gap-2"
      >
        <template v-if="editing === reward.id">
          <div class="space-y-2 py-1">
            <div>
              <label class="block text-[11px] text-surface-400 mb-1">積分門檻</label>
              <input v-model.number="editForm.points_required" type="number" min="1" class="w-full px-3 py-2 bg-surface-700 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
            <div>
              <label class="block text-[11px] text-surface-400 mb-1">獎勵名稱</label>
              <input v-model="editForm.name" class="w-full px-3 py-2 bg-surface-700 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
          </div>
          <div class="flex gap-2 justify-end pt-2 border-t border-white/10">
            <button class="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-xs font-bold hover:bg-green-500/30 transition" @click="saveEdit(reward.id)">儲存</button>
            <button class="px-4 py-2 bg-surface-700 text-surface-300 rounded-xl text-xs font-semibold hover:bg-surface-600 transition" @click="editing = null">取消</button>
          </div>
        </template>
        <template v-else>
          <div class="flex items-start justify-between">
            <div class="font-bold text-base text-white flex items-center gap-2">
              <span>🎁</span>
              <span>{{ reward.name }}</span>
            </div>
            <div class="text-right">
              <span class="text-lg font-black text-accent-400">{{ reward.points_required }}</span>
              <span class="text-xs text-surface-400 ml-0.5">分</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-white/5">
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
              :class="reward.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'"
            >
              {{ reward.status === 'active' ? '啟用中' : '已停用' }}
            </span>
            <div class="flex gap-2">
              <button class="px-3 py-1.5 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-xl text-xs font-bold" @click="startEdit(reward)">編輯</button>
              <button
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                :class="reward.status === 'active' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'"
                @click="toggleStatus(reward)"
              >
                {{ reward.status === 'active' ? '停用' : '啟用' }}
              </button>
            </div>
          </div>
        </template>
      </div>
      <div v-if="(rewards || []).length === 0" class="text-center py-12 text-surface-400 text-sm">尚無獎勵</div>
    </div>

    <!-- Desktop Rewards Table (>= md) -->
    <div class="hidden md:block bg-surface-800/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10 bg-surface-800/80">
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">積分門檻</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">獎勵名稱</th>
              <th class="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase">狀態</th>
              <th class="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="reward in rewards"
              :key="reward.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <template v-if="editing === reward.id">
                <td class="px-6 py-3">
                  <input v-model.number="editForm.points_required" type="number" min="1" class="w-24 px-3 py-2 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">
                  <input v-model="editForm.name" class="w-full px-3 py-2 bg-surface-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </td>
                <td class="px-6 py-3">—</td>
                <td class="px-6 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition" @click="saveEdit(reward.id)">儲存</button>
                    <button class="px-3 py-1.5 bg-surface-600/50 text-surface-300 rounded-lg text-xs font-semibold hover:bg-surface-600 transition" @click="editing = null">取消</button>
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="px-6 py-4 text-sm text-accent-400 font-bold">{{ reward.points_required }} 分</td>
                <td class="px-6 py-4 text-sm font-semibold">{{ reward.name }}</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="reward.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
                  >
                    {{ reward.status === 'active' ? '啟用中' : '已停用' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-end">
                    <button class="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-lg text-xs font-semibold hover:bg-primary-500/30 transition" @click="startEdit(reward)">編輯</button>
                    <button
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      :class="reward.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
                      @click="toggleStatus(reward)"
                    >
                      {{ reward.status === 'active' ? '停用' : '啟用' }}
                    </button>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-if="(rewards || []).length === 0" class="text-center py-12 text-surface-400">尚無獎勵</div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

interface Reward { id: number; points_required: number; name: string; status: string }

const { data: rewards, refresh } = await useFetch<Reward[]>('/api/admin/rewards')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editing = ref<number | null>(null)
const editForm = reactive({ points_required: 0, name: '' })
const newReward = reactive({ points_required: 100, name: '' })

function showMessage(msg: string, type: 'success' | 'error' = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function addReward() {
  try {
    await $fetch('/api/admin/rewards', { method: 'POST', body: { points_required: newReward.points_required, name: newReward.name } })
    newReward.points_required = 100
    newReward.name = ''
    showMessage('獎勵已新增！')
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '新增失敗', 'error')
  }
}

function startEdit(reward: Reward) {
  editing.value = reward.id
  editForm.points_required = reward.points_required
  editForm.name = reward.name
}

async function saveEdit(id: number) {
  try {
    await $fetch(`/api/admin/rewards/${id}`, { method: 'PATCH', body: { points_required: editForm.points_required, name: editForm.name } })
    editing.value = null
    showMessage('已更新！')
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '更新失敗', 'error')
  }
}

async function toggleStatus(reward: Reward) {
  const newStatus = reward.status === 'active' ? 'inactive' : 'active'
  try {
    await $fetch(`/api/admin/rewards/${reward.id}`, { method: 'PATCH', body: { status: newStatus } })
    showMessage(`已${newStatus === 'active' ? '啟用' : '停用'}！`)
    await refresh()
  } catch (e: any) {
    showMessage(e.data?.message || '操作失敗', 'error')
  }
}

useHead({ title: '管理後台 - 獎勵管理' })
</script>
