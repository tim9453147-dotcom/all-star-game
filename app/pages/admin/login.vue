<template>
  <div class="min-h-screen bg-surface-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-surface-800 rounded-xl shadow-2xl p-8 border border-surface-700">
      <h1 class="text-3xl font-bold text-center text-primary-400 mb-8">管理員登入</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">帳號</label>
          <input 
            v-model="username" 
            type="text" 
            required
            class="w-full bg-surface-900 border border-surface-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">密碼</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full bg-surface-900 border border-surface-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        </div>
        <div v-if="error" class="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-500/20">
          {{ error }}
        </div>
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? '登入中...' : '登入' }}
        </button>
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
