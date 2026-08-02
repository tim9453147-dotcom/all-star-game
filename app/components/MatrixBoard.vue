<template>
  <div class="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4">
    <!-- Matrix Grid Container -->
    <div class="bg-surface-800/50 backdrop-blur-xl border border-white/10 p-3 sm:p-5 rounded-3xl shadow-2xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
          <span>🧱</span> 全景 100 格矩陣圖
        </h3>
        <span class="text-xs text-surface-400 font-mono">10 x 10 GRID</span>
      </div>

      <div class="grid grid-cols-10 gap-1.5 sm:gap-2">
        <div
          v-for="cell in matrixCells"
          :key="cell.index"
          class="relative aspect-square rounded-xl flex flex-col items-center justify-center font-bold text-xs select-none transition-all duration-200 cursor-pointer border hover:scale-105 group"
          :class="[
            getCellStyle(cell.index),
            highlightedCell === cell.index ? 'ring-2 ring-amber-400 scale-105 z-10' : ''
          ]"
          @click="handleCellClick(cell.index)"
        >
          <!-- Cell Number or Icon -->
          <span v-if="cell.index === 0" class="text-[9px] sm:text-xs font-black text-emerald-300">START</span>
          <span v-else-if="cell.index === 99" class="text-[9px] sm:text-xs font-black text-amber-300">🏆</span>
          <span v-else-if="cell.index % 10 === 0" class="text-[10px] sm:text-xs font-black text-amber-400">{{ cell.index }}</span>
          <span v-else class="text-[10px] sm:text-xs font-semibold opacity-70">{{ cell.index }}</span>

          <!-- Player Avatars Badge Stack -->
          <div
            v-if="cellPlayers(cell.index).length > 0"
            class="absolute -top-1.5 -right-1.5 flex -space-x-1 z-20"
          >
            <div
              v-for="player in cellPlayers(cell.index).slice(0, 2)"
              :key="player.id"
              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white shadow-md border border-white/60"
              :class="getPlayerColor(player.id)"
            >
              {{ player.player_id.charAt(0).toUpperCase() }}
            </div>
            <div
              v-if="cellPlayers(cell.index).length > 2"
              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-surface-900 border border-white/60 flex items-center justify-center text-[7px] font-bold text-white shadow"
            >
              +{{ cellPlayers(cell.index).length - 2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Player {
  id: number
  player_id: string
  name: string
  total_score: number
  status: string
}

const props = defineProps<{
  players: Player[]
}>()

const emit = defineEmits<{
  (e: 'select-player', player: Player): void
}>()

const highlightedCell = ref<number | null>(null)

// Generate 10x10 Snake Matrix layout
const matrixCells = computed(() => {
  const result = []
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      // Snake row direction: Even row L->R, Odd row R->L
      const index = r % 2 === 0 ? r * 10 + c : r * 10 + (9 - c)
      result.push({ index, row: r, col: c })
    }
  }
  return result
})

function cellPlayers(cellIndex: number) {
  return props.players.filter((p) => (p.total_score % 100) === cellIndex)
}

function getCellStyle(index: number) {
  if (index === 0) return 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200 shadow-sm shadow-emerald-500/20'
  if (index === 99) return 'bg-amber-500/25 border-amber-400/50 text-amber-200 shadow-sm shadow-amber-500/20'
  if (index % 10 === 0) return 'bg-amber-500/15 border-amber-400/30 text-amber-300'
  return 'bg-surface-800/80 border-white/5 text-surface-300 hover:bg-surface-700/80 hover:border-white/20'
}

const tokenColors = [
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-blue-500 to-cyan-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-purple-500 to-violet-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-teal-500 to-indigo-600',
]

function getPlayerColor(id: number) {
  return tokenColors[id % tokenColors.length]
}

function handleCellClick(cellIndex: number) {
  highlightedCell.value = cellIndex
  const playersOnCell = cellPlayers(cellIndex)
  if (playersOnCell.length > 0) {
    emit('select-player', playersOnCell[0])
  }
}
</script>
