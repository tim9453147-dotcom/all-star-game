<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-12">
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
        🎁 獎勵一覽
      </h1>
      <p class="text-surface-400 text-sm sm:text-lg">累積積分解鎖豐富獎勵</p>
    </div>

    <div class="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
      <div
        v-for="reward in rewards"
        :key="reward.id"
        class="relative overflow-hidden rounded-2xl border transition-all duration-300 active:scale-[0.99] md:hover:scale-[1.02]"
        :class="isUnlocked(reward)
          ? 'bg-gradient-to-br from-accent-500/10 to-accent-600/5 border-accent-500/30 shadow-lg shadow-accent-500/10'
          : 'bg-surface-800/50 border-white/10'"
      >
        <!-- Unlocked Badge -->
        <div
          v-if="isUnlocked(reward)"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 bg-accent-500/20 border border-accent-500/30 rounded-full text-[11px] sm:text-xs font-bold text-accent-300"
        >
          🎉 已有人解鎖！
        </div>

        <div class="p-5 sm:p-8">
          <!-- Icon -->
          <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">
            {{ isUnlocked(reward) ? '🏆' : '🔒' }}
          </div>

          <!-- Points Threshold -->
          <div class="mb-2">
            <span
              class="text-2xl sm:text-3xl font-black"
              :class="isUnlocked(reward) ? 'text-accent-400' : 'text-surface-300'"
            >
              {{ reward.points_required }}
            </span>
            <span class="text-surface-400 ml-1 text-base sm:text-lg">分</span>
          </div>

          <!-- Reward Name -->
          <h3 class="text-lg sm:text-xl font-bold text-white mb-4 leading-snug">{{ reward.name }}</h3>

          <!-- Progress Bar -->
          <div class="w-full bg-surface-700/50 rounded-full h-2 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :class="isUnlocked(reward) ? 'bg-gradient-to-r from-accent-500 to-accent-400' : 'bg-primary-500/50'"
              :style="{ width: Math.min(100, (highestScore / reward.points_required) * 100) + '%' }"
            />
          </div>
          <div class="mt-2 text-[11px] sm:text-xs text-surface-400">
            最高分 {{ highestScore }} / {{ reward.points_required }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="rewards.length === 0" class="text-center py-16 text-surface-400">
      <div class="text-5xl mb-4">🎁</div>
      <p class="text-sm">尚未設定獎勵</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Reward {
  id: number
  points_required: number
  name: string
}
interface Player {
  id: number
  total_score: number
}

const { data: rewardsData } = await useFetch<Reward[]>('/api/rewards')
const { data: playersData } = await useFetch<Player[]>('/api/players')

const rewards = computed(() => rewardsData.value || [])
const highestScore = computed(() => (playersData.value || [])[0]?.total_score ?? 0)

function isUnlocked(reward: Reward) {
  return highestScore.value >= reward.points_required
}

useHead({ title: 'All-Star - 獎勵' })
</script>

