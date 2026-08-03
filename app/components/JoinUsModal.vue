<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" @click="$emit('close')" />

      <!-- Modal Content -->
      <div class="relative w-full max-w-md bg-surface-800/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-fade-in backdrop-blur-2xl text-white max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-surface-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-20"
          @click="$emit('close')"
        >
          ✕
        </button>

        <div class="text-center mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg ring-2 ring-white/20">
            🚀
          </div>
          <h2 class="text-2xl font-extrabold bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
            加入 All-Star 遊戲
          </h2>
          <p class="text-xs sm:text-sm text-surface-400 mt-1">申請加入 All-Star，A70 邁向鑽石！</p>
        </div>

        <!-- Success State -->
        <div v-if="submitted" class="text-center py-6 px-4 bg-surface-900/60 border border-green-500/30 rounded-2xl">
          <div class="text-5xl mb-3">🎉</div>
          <h3 class="text-xl font-bold text-green-400 mb-1">申請已送出！</h3>
          <p class="text-surface-300 text-xs sm:text-sm mb-5">管理員審核通過後，你就會出現在棋盤上囉！</p>
          <button
            @click="$emit('close')"
            class="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 rounded-xl font-bold text-sm transition shadow-lg active:scale-95"
          >
            🎮 了解，回到棋盤
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Game Info -->
          <div class="p-3.5 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <h4 class="text-xs font-bold text-primary-300 mb-1">📖 遊戲說明</h4>
            <p class="text-xs text-surface-300 leading-relaxed">
              完成任務即可獲得積分，在大富翁棋盤上前進！
            </p>
          </div>

          <div>
            <label for="modal_player_id" class="block text-xs sm:text-sm font-semibold text-surface-200 mb-1.5">
              遊戲 ID
            </label>
            <input
              id="modal_player_id"
              v-model="form.player_id"
              type="text"
              required
              placeholder="輸入遊戲 ID"
              class="w-full px-4 py-3 bg-surface-900/80 border border-white/10 rounded-xl text-base text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div>
            <label for="modal_name" class="block text-xs sm:text-sm font-semibold text-surface-200 mb-1.5">
              姓名
            </label>
            <input
              id="modal_name"
              v-model="form.name"
              type="text"
              required
              placeholder="輸入本名"
              class="w-full px-4 py-3 bg-surface-900/80 border border-white/10 rounded-xl text-base text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
            <p class="mt-1 text-xs text-surface-400">🔒 姓名僅供管理員核對身分</p>
          </div>

          <!-- Avatar Selector -->
          <div>
            <CharacterSelector v-model="form.avatar" />
          </div>

          <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 rounded-xl font-bold text-base transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-500/20 active:scale-[0.98]"
          >
            <span v-if="loading">⏳ 送出中...</span>
            <span v-else>🚀 送出申請</span>
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
}>(), {
  show: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = reactive({
  player_id: '',
  name: '',
  avatar: 'char-1',
})
const loading = ref(false)
const error = ref('')
const submitted = ref(false)

async function handleSubmit() {
  if (!form.player_id.trim() || !form.name.trim()) {
    error.value = '請填寫所有欄位'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/players/apply', {
      method: 'POST',
      body: {
        player_id: form.player_id.trim(),
        name: form.name.trim(),
        avatar: form.avatar,
      },
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e.data?.message || e.message || '申請失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
