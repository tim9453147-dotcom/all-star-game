<template>
  <div class="max-w-xl mx-auto px-4 py-6 sm:py-12">
    <div class="text-center mb-8 sm:mb-10">
      <h1 class="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
        🚀 加入遊戲
      </h1>
      <p class="text-surface-400 text-sm sm:text-lg">申請加入 All-Star，A70 邁向鑽石！</p>
    </div>

    <!-- Success State -->
    <div v-if="submitted" class="text-center py-10 sm:py-12 px-6 bg-surface-800/50 backdrop-blur border border-green-500/20 rounded-3xl shadow-xl">
      <div class="text-5xl sm:text-6xl mb-4">🎉</div>
      <h2 class="text-xl sm:text-2xl font-bold text-green-400 mb-2">申請已送出！</h2>
      <p class="text-surface-300 text-sm sm:text-base mb-6">管理員審核通過後，你就會出現在棋盤上囉！</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all shadow-lg active:scale-95"
      >
        🎮 前往棋盤
      </NuxtLink>
    </div>

    <!-- Form -->
    <div v-else class="bg-surface-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl">
      <!-- Game Info -->
      <div class="mb-6 sm:mb-8 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
        <h3 class="text-xs sm:text-sm font-bold text-primary-300 mb-2">📖 遊戲說明</h3>
        <ul class="text-xs sm:text-sm text-surface-300 space-y-1.5 leading-relaxed">
          <li>• 完成任務即可獲得積分</li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5 sm:space-y-6">
        <!-- Player ID -->
        <div>
          <label for="player_id" class="block text-xs sm:text-sm font-semibold text-surface-200 mb-2">
            你的 ID
          </label>
          <input
            id="player_id"
            v-model="form.player_id"
            type="text"
            required
            placeholder="輸入你想要的 ID"
            class="w-full px-4 py-3 bg-surface-700/50 border border-white/10 rounded-xl text-base text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
          />
        </div>

        <!-- Name -->
        <div>
          <label for="name" class="block text-xs sm:text-sm font-semibold text-surface-200 mb-2">
            你的姓名
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="輸入你的姓名"
            class="w-full px-4 py-3 bg-surface-700/50 border border-white/10 rounded-xl text-base text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
          />
          <p class="mt-1 text-xs text-surface-400">🔒 姓名僅供管理員核對，遊戲畫面中只會顯示您的 ID。</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-500/20 active:scale-[0.98]"
        >
          <span v-if="loading">⏳ 送出中...</span>
          <span v-else>🚀 送出申請</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  player_id: '',
  name: '',
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
      },
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e.data?.message || e.message || '申請失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'All-Star' })
</script>

