<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-black mb-3 bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
        🎁 獎勵一覽
      </h1>
      <p class="text-surface-400 text-lg">累積積分解鎖豐富獎勵</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div
        v-for="reward in rewards"
        :key="reward.id"
        class="relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02]"
        :class="isUnlocked(reward)
          ? 'bg-gradient-to-br from-accent-500/10 to-accent-600/5 border-accent-500/30 shadow-lg shadow-accent-500/10'
          : 'bg-surface-800/50 border-white/10'"
      >
        <!-- Unlocked Badge -->
        <div
          v-if="isUnlocked(reward)"
          class="absolute top-4 right-4 px-3 py-1 bg-accent-500/20 border border-accent-500/30 rounded-full text-xs font-bold text-accent-300"
        >
          🎉 已有人解鎖！
        </div>

        <div class="p-8">
          <!-- Icon -->
          <div class="text-5xl mb-4">
            {{ isUnlocked(reward) ? '🏆' : '🔒' }}
          </div>

          <!-- Points Threshold -->
          <div class="mb-2">
            <span
              class="text-3xl font-black"
              :class="isUnlocked(reward) ? 'text-accent-400' : 'text-surface-300'"
            >
              {{ reward.points_required }}
            </span>
            <span class="text-surface-400 ml-1 text-lg">分</span>
          </div>

          <!-- Reward Name -->
          <h3 class="text-xl font-bold text-white mb-4">{{ reward.name }}</h3>

          <!-- Progress Bar -->
          <div class="w-full bg-surface-700/50 rounded-full h-2 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :class="isUnlocked(reward) ? 'bg-gradient-to-r from-accent-500 to-accent-400' : 'bg-primary-500/50'"
              :style="{ width: Math.min(100, (highestScore / reward.points_required) * 100) + '%' }"
            />
          </div>
          <div class="mt-2 text-xs text-surface-400">
            最高分 {{ highestScore }} / {{ reward.points_required }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="rewards.length === 0" class="text-center py-20 text-surface-400">
      <div class="text-5xl mb-4">🎁</div>
      <p>尚未設定獎勵</p>
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
const highestScore = computed(() => {
  const p = playersData.value || []
  return p.length > 0 ? p[0].total_score : 0
})

function isUnlocked(reward: Reward) {
  return highestScore.value >= reward.points_required
}

useHead({ title: '積分大富翁 - 獎勵' })
</script>
