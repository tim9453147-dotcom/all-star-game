<template>
  <Teleport to="body">
    <div v-if="player" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" @click="$emit('close')" />

      <!-- Sheet Modal Content -->
      <div class="relative w-full sm:max-w-md bg-surface-800/95 border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 animate-slide-up backdrop-blur-2xl">
        <div class="w-12 h-1.5 bg-surface-600 rounded-full mx-auto mb-5 sm:hidden" />

        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-surface-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          @click="$emit('close')"
        >
          ✕
        </button>

        <!-- Player Profile Header -->
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-2xl font-black text-white shadow-xl ring-2 ring-white/20">
            {{ player.player_id ? player.player_id.charAt(0).toUpperCase() : '?' }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-extrabold text-white">{{ player.player_id }}</h3>
              <span v-if="isLeader" class="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-0.5">
                👑 第一名
              </span>
            </div>
            <p class="text-xs text-surface-400 font-mono">匿名玩家</p>
          </div>
        </div>

        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-surface-700/40 border border-white/10 rounded-2xl p-4 text-center backdrop-blur">
            <div class="text-xs text-surface-400 mb-1 flex items-center justify-center gap-1">
              <span>🏆</span> 累積總積分
            </div>
            <div class="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {{ player.total_score }}
            </div>
          </div>

          <div class="bg-surface-700/40 border border-white/10 rounded-2xl p-4 text-center backdrop-blur">
            <div class="text-xs text-surface-400 mb-1 flex items-center justify-center gap-1">
              <span>📍</span> 棋盤位置
            </div>
            <div class="text-lg font-bold text-primary-300">
              第 {{ lapCount }} 圈 · 格子 {{ currentTile }}
            </div>
          </div>
        </div>

        <!-- Progress to Next Lap -->
        <div class="bg-surface-900/60 border border-white/10 rounded-2xl p-4 mb-6">
          <div class="flex items-center justify-between text-xs text-surface-300 font-semibold mb-2">
            <span>本圈進度 ({{ currentTile }} / 100)</span>
            <span class="text-accent-400 font-mono">{{ 100 - currentTile }} 格完賽</span>
          </div>
          <div class="w-full h-2.5 bg-surface-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-amber-400 rounded-full transition-all duration-500"
              :style="{ width: `${currentTile}%` }"
            />
          </div>
        </div>

        <!-- Action Button -->
        <button
          class="w-full py-3.5 bg-surface-700 hover:bg-surface-600 rounded-xl font-bold text-sm text-white transition active:scale-95 border border-white/10 shadow-lg"
          @click="$emit('close')"
        >
          關閉
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Player {
  id: number
  player_id: string
  name: string
  total_score: number
  status: string
}

const props = defineProps<{
  player: Player | null
  isLeader?: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const lapCount = computed(() => {
  if (!props.player) return 1
  return Math.floor((props.player.total_score - 1) / 100) + 1
})

const currentTile = computed(() => {
  if (!props.player) return 1
  const pos = props.player.total_score % 100
  return pos === 0 ? (props.player.total_score > 0 ? 100 : 1) : pos
})
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
