<template>
  <Teleport to="body">
    <div v-if="tileNum !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" @click="$emit('close')" />

      <!-- Sheet Modal Content -->
      <div class="relative w-full max-w-xs bg-surface-800/95 border border-white/15 rounded-3xl p-5 shadow-2xl z-10 animate-slide-up backdrop-blur-2xl text-center">
        <!-- Close Button (Top-right X icon) -->
        <button
          class="absolute top-3 right-3 text-surface-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          @click="$emit('close')"
        >
          ✕
        </button>

<<<<<<< Updated upstream
        <!-- Player List Only -->
        <div class="my-2 max-h-60 overflow-y-auto space-y-2 py-1">
          <template v-if="players && players.length > 0">
=======
        <!-- Player Profile Header -->
        <div class="flex items-center gap-4 mb-6">
          <PlayerAvatar
            :avatar="player.avatar"
            :name="player.name"
            size="xl"
            shape="square"
            :border="true"
            :ring="true"
            :show-badge="true"
            class="shrink-0 shadow-xl"
          />
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-extrabold text-white">{{ player.name }}</h3>
              <span v-if="isLeader" class="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-0.5">
                👑 第一名
              </span>
            </div>
            <p class="text-xs text-surface-400 font-mono">ID: {{ player.player_id }}</p>
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
>>>>>>> Stashed changes
            <div
              v-for="p in players"
              :key="p.id"
              class="px-4 py-2.5 bg-surface-700/60 border border-white/10 rounded-xl text-white font-mono font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              {{ p.player_id }}
            </div>
          </template>
          <template v-else>
            <div class="py-2 text-surface-400 text-sm font-medium">
              此格子目前無玩家
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Player {
  id: number
  player_id: string
  name: string
  avatar?: string
  total_score: number
  status: string
}

defineProps<{
  tileNum: number | null
  players: Player[]
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
