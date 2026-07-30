<template>
  <div class="min-h-screen bg-surface-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-surface-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-surface-700">
      <div class="text-center mb-6">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
          🔐
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">管理員登入</h1>
        <p class="text-xs sm:text-sm text-surface-400 mt-1">請輸入存取憑證以進入後台</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-surface-300 mb-1.5">帳號</label>
          <input 
            v-model="username" 
            type="text" 
            required
            placeholder="請輸入帳號"
            class="w-full bg-surface-900 border border-surface-600 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-surface-300 mb-1.5">密碼</label>
          <input 
            v-model="password" 
            type="password" 
            required
            placeholder="請輸入密碼"
            class="w-full bg-surface-900 border border-surface-600 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
        </div>
        <div v-if="error" class="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 p-3 rounded-xl border border-red-500/20">
          {{ error }}
        </div>
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 active:scale-95"
        >
          {{ loading ? '⏳ 登入中...' : '🔐 登入管理後台' }}
        </button>

        <div class="text-center pt-2">
          <NuxtLink to="/" class="text-xs text-surface-400 hover:text-surface-200 transition">
            ← 返回前台大富翁
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const adminStore = useAdminStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const success = await adminStore.login(username.value, password.value)
  if (success) {
    router.push('/admin')
  } else {
    error.value = '登入失敗，請檢查帳號密碼'
  }
  
  loading.value = false
}
</script>

