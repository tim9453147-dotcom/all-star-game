<template>
  <div class="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 flex flex-col items-center justify-center">
    <!-- Header -->
    <div class="mb-4 text-center">
      <span class="text-xs font-mono text-purple-400 tracking-widest uppercase">PANORAMA VIEW 01</span>
      <h3 class="text-lg sm:text-2xl font-black text-white flex items-center justify-center gap-2">
        <span>🌀</span> 螺旋星際全景賽道
      </h3>
      <p class="text-xs text-surface-400 mt-0.5">由外向內環繞延伸的 100 格星際螺旋軌道</p>
    </div>

    <!-- Spiral Board Canvas Container -->
    <div
      ref="spiralContainer"
      class="relative flex items-center justify-center transition-all duration-300 touch-pan-x touch-pan-y my-2"
      :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
    >
      <!-- Galactic Ambient Glow -->
      <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-pink-900/30 blur-2xl pointer-events-none" />
      <div class="absolute inset-4 rounded-full border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.15)] pointer-events-none" />

      <!-- Center Victory Crystal -->
      <div
        class="absolute flex flex-col items-center justify-center text-center rounded-full bg-surface-900/80 border-2 border-amber-400/50 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.3)] z-10 pointer-events-none"
        :style="{ width: centerSize + 'px', height: centerSize + 'px' }"
      >
        <span class="text-2xl sm:text-4xl animate-bounce-slow">👑</span>
        <span class="text-[9px] sm:text-xs font-black text-amber-300 tracking-wider">GOAL 99</span>
      </div>

      <!-- SVG Path Connecting the Spiral -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
        <path
          v-if="spiralPathD"
          :d="spiralPathD"
          fill="none"
          stroke="url(#spiralGradient)"
          stroke-width="3"
          stroke-linecap="round"
          class="opacity-60"
        />
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="50%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Cells along Archimedean / Concentric Spiral -->
      <div
        v-for="cell in spiralCells"
        :key="cell.index"
        class="absolute rounded-xl flex items-center justify-center font-extrabold select-none transition-all duration-300 cursor-pointer shadow-md group"
        :class="[
          getCellStyle(cell.index),
          cellSizeClass,
          highlightedCell === cell.index ? 'ring-4 ring-amber-400 scale-125 z-30' : ''
        ]"
        :style="{ top: cell.y + 'px', left: cell.x + 'px' }"
        @click="handleCellClick(cell.index)"
      >
        <span v-if="cell.index === 0" class="font-black text-emerald-300">START</span>
        <span v-else-if="cell.index === 99" class="font-black text-amber-300">99</span>
        <span v-else-if="cell.index % 10 === 0" class="font-black text-amber-400">{{ cell.index }}</span>
        <span v-else class="opacity-80 font-mono">{{ cell.index }}</span>

        <!-- Player Tokens on Cell -->
        <div
          v-if="cellPlayers(cell.index).length > 0"
          class="absolute -top-2 -right-2 flex -space-x-1.5 z-20"
        >
          <div
            v-for="player in cellPlayers(cell.index).slice(0, 2)"
            :key="player.id"
            class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-xs font-black text-white shadow-lg border border-white/60"
            :class="getPlayerColor(player.id)"
            :title="player.player_id"
            @click.stop="$emit('select-player', player)"
          >
            {{ player.player_id.charAt(0).toUpperCase() }}
          </div>
          <div
            v-if="cellPlayers(cell.index).length > 2"
            class="w-5 h-5 rounded-full bg-surface-900 border border-white/60 flex items-center justify-center text-[8px] font-bold text-white shadow"
          >
            +{{ cellPlayers(cell.index).length - 2 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

const windowWidth = ref(1024)
const highlightedCell = ref<number | null>(null)

const boardSize = computed(() => {
  if (windowWidth.value < 400) return Math.max(310, windowWidth.value - 24)
  if (windowWidth.value < 640) return Math.min(windowWidth.value - 32, 450)
  if (windowWidth.value < 1024) return 560
  return 620
})

const centerSize = computed(() => boardSize.value * 0.18)

const cellSizeClass = computed(() => {
  if (boardSize.value < 360) return 'w-5 h-5 -ml-2.5 -mt-2.5 text-[7px]'
  if (boardSize.value < 460) return 'w-6 h-6 -ml-3 -mt-3 text-[8px]'
  return 'w-7 h-7 -ml-3.5 -mt-3.5 text-[9px]'
})

interface SpiralCell {
  index: number
  x: number
  y: number
}

// Compute Archimedean spiral coordinates for 100 tiles
const spiralCells = computed<SpiralCell[]>(() => {
  const center = boardSize.value / 2
  const maxRadius = boardSize.value / 2 - (boardSize.value < 400 ? 24 : 32)
  const minRadius = centerSize.value / 2 + (boardSize.value < 400 ? 16 : 22)
  const totalTurns = 3.5

  return Array.from({ length: 100 }, (_, i) => {
    const progress = i / 99 // 0 to 1
    // Radius decreases as index increases (outer to inner)
    const r = maxRadius - progress * (maxRadius - minRadius)
    const angle = progress * totalTurns * 2 * Math.PI - Math.PI / 2
    return {
      index: i,
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })
})

const spiralPathD = computed(() => {
  if (spiralCells.value.length === 0) return ''
  let d = `M ${spiralCells.value[0].x} ${spiralCells.value[0].y}`
  for (let i = 1; i < spiralCells.value.length; i++) {
    d += ` L ${spiralCells.value[i].x} ${spiralCells.value[i].y}`
  }
  return d
})

function cellPlayers(cellIndex: number) {
  return props.players.filter((p) => (p.total_score % 100) === cellIndex)
}

function getCellStyle(index: number) {
  if (index === 0) return 'bg-emerald-500/40 border border-emerald-400 text-emerald-200 shadow-emerald-500/30'
  if (index === 99) return 'bg-amber-500/40 border border-amber-400 text-amber-200 shadow-amber-500/30'
  if (index % 10 === 0) return 'bg-purple-500/30 border border-purple-400/40 text-purple-200 shadow-purple-500/20'
  return 'bg-surface-800/80 border border-white/10 text-surface-300 hover:bg-surface-700 hover:border-white/30'
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

function handleCellClick(index: number) {
  highlightedCell.value = index
  const playersOnCell = cellPlayers(index)
  if (playersOnCell.length > 0) {
    emit('select-player', playersOnCell[0])
  }
}

function updateWindowSize() {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowSize)
  }
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2.5s ease-in-out infinite;
}
</style>
