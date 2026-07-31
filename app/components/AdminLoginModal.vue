<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" @click="$emit('close')" />

      <!-- Modal Card -->
      <div class="relative w-full max-w-md bg-surface-800/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-fade-in backdrop-blur-2xl text-white">
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-surface-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          @click="$emit('close')"
        >
          ✕
        </button>

        <div class="text-center mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg ring-2 ring-white/20">
            🔐
          </div>
          <h2 class="text-2xl font-extrabold text-white">管理員登入</h2>
          <p class="text-xs sm:text-sm text-surface-400 mt-1">請輸入帳號密碼以進入後台</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-surface-300 mb-1.5">帳號</label>
            <input
              v-model="username"
              type="text"
              required
              placeholder="請輸入帳號"
              class="w-full bg-surface-900/80 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-surface-300 mb-1.5">密碼</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="請輸入密碼"
              class="w-full bg-surface-900/80 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div v-if="error" class="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 p-3 rounded-xl border border-red-500/20">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 active:scale-95 text-base mt-2"
          >
            {{ loading ? '⏳ 登入中...' : '🔐 登入管理後台' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
}>(), {
  show: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const adminStore = useAdminStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) return

  loading.value = true
  error.value = ''

  const success = await adminStore.login(username.value.trim(), password.value.trim())
  if (success) {
    emit('success')
  } else {
    error.value = '登入失敗，請檢查帳號與密碼'
  }

  loading.value = false
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
