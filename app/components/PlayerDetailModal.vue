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

        <!-- Player List Only -->
        <div class="my-2 max-h-60 overflow-y-auto space-y-2 py-1">
          <template v-if="players && players.length > 0">
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
