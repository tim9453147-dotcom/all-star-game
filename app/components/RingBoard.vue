<template>
  <div class="w-full flex flex-col items-center justify-center py-4">
    <!-- Circular Board Wrapper -->
    <div
      ref="boardWrapper"
      class="relative flex items-center justify-center transition-all duration-300 touch-pan-x touch-pan-y"
      :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
    >
      <!-- Background Outer & Inner Rings with Neon Glow -->
      <div class="absolute inset-0 rounded-full border-2 border-primary-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] bg-surface-900/30 backdrop-blur-xs" />

      <!-- Center Star / Trophy Landmark -->
      <div class="absolute flex flex-col items-center justify-center text-center p-4 rounded-full bg-surface-800/40 border border-white/10 backdrop-blur-md shadow-2xl pointer-events-none"
           :style="{ width: radius * 0.9 + 'px', height: radius * 0.9 + 'px' }">
        <div class="text-3xl sm:text-5xl mb-1 animate-pulse">🌟</div>
        <div class="text-xs sm:text-base font-extrabold bg-gradient-to-r from-primary-300 via-accent-300 to-amber-300 bg-clip-text text-transparent">
          ALL-STAR
        </div>
        <div class="text-[10px] sm:text-xs text-surface-400 font-mono mt-0.5">100 CELLS ARENA</div>
      </div>

      <!-- Ring Guide Lines -->
      <div
        class="absolute rounded-full border border-primary-500/20 pointer-events-none"
        :style="{
          top: (boardSize / 2 - radius - 16) + 'px',
          left: (boardSize / 2 - radius - 16) + 'px',
          width: (radius + 16) * 2 + 'px',
          height: (radius + 16) * 2 + 'px',
        }"
      />
      <div
        class="absolute rounded-full border border-accent-500/20 pointer-events-none"
        :style="{
          top: (boardSize / 2 - radius + 16) + 'px',
          left: (boardSize / 2 - radius + 16) + 'px',
          width: (radius - 16) * 2 + 'px',
          height: (radius - 16) * 2 + 'px',
        }"
      />

      <!-- Cells -->
      <div
        v-for="cell in cells"
        :key="cell.index"
        class="absolute rounded-md flex items-center justify-center font-extrabold transition-all duration-300 select-none cursor-pointer"
        :class="[cellClass(cell), cellSizeClass]"
        :style="{ top: cell.y + 'px', left: cell.x + 'px' }"
        :title="'格子 ' + cell.index"
        @click="handleCellClick(cell.index)"
      >
        <span v-if="cell.index === 0" class="text-[9px] sm:text-xs font-black text-emerald-300">START</span>
        <span v-else-if="cell.index === 99" class="text-[9px] sm:text-xs font-black text-amber-300">GOAL</span>
        <span v-else-if="cell.index % 10 === 0" class="font-black text-amber-400">{{ cell.index }}</span>
      </div>

      <!-- Player Tokens -->
      <div
        v-for="(player, pi) in playersOnBoard"
        :key="player.id"
        class="absolute group z-10 cursor-pointer transition-transform duration-200 hover:scale-125 hover:z-30"
        :class="playerTokenSizeClass"
        :style="{ top: player.y + 'px', left: player.x + 'px' }"
        @click.stop="$emit('select-player', player)"
      >
        <PlayerAvatar
          :avatar="player.avatar"
          :name="player.name"
          size="sm"
          shape="circle"
          :border="true"
          :ring="topPlayerId === player.id"
          class="w-full h-full shadow-xl transition-all duration-300 shrink-0"
        />

        <!-- Desktop Hover Tooltip -->
        <div class="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-800/95 backdrop-blur border border-white/10 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-30">
          <div class="font-bold text-white">{{ player.player_id }}</div>
          <div class="text-accent-400 font-semibold">{{ player.total_score }} 分</div>
          <div class="text-surface-400">第 {{ Math.floor(player.total_score / 100) }} 圈 · 格子 {{ player.total_score % 100 }}</div>
          <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-surface-800 border-r border-b border-white/10 rotate-45" />
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
  avatar?: string
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

const topPlayerId = computed(() => {
  if (!props.players || props.players.length === 0) return null
  return [...props.players].sort((a, b) => b.total_score - a.total_score)[0]?.id
})

const boardSize = computed(() => {
  if (windowWidth.value < 400) return Math.max(300, windowWidth.value - 32)
  if (windowWidth.value < 640) return Math.min(windowWidth.value - 40, 440)
  if (windowWidth.value < 1024) return 540
  return 600
})

const radius = computed(() => boardSize.value / 2 - (boardSize.value < 400 ? 30 : 40))

const cellSizeClass = computed(() => {
  if (boardSize.value < 360) return 'w-5 h-5 -ml-2.5 -mt-2.5 text-[7px]'
  if (boardSize.value < 440) return 'w-6 h-6 -ml-3 -mt-3 text-[8px]'
  return 'w-7 h-7 -ml-3.5 -mt-3.5 text-[9px]'
})

const playerTokenSizeClass = computed(() => {
  if (boardSize.value < 360) return 'w-7 h-7 -ml-3.5 -mt-3.5'
  if (boardSize.value < 440) return 'w-8 h-8 -ml-4 -mt-4'
  return 'w-10 h-10 -ml-5 -mt-5'
})

const tokenFontSizeClass = computed(() => {
  if (boardSize.value < 360) return 'text-[10px]'
  if (boardSize.value < 440) return 'text-xs'
  return 'text-sm'
})

interface Cell {
  index: number
  x: number
  y: number
}

const cells = computed<Cell[]>(() => {
  const center = boardSize.value / 2
  const r = radius.value
  return Array.from({ length: 100 }, (_, i) => {
    const angle = ((i / 100) * 360 - 90) * (Math.PI / 180)
    return {
      index: i,
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })
})

const tokenColors = [
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-blue-500 to-cyan-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-purple-500 to-violet-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-teal-500 to-indigo-600',
]

const playersOnBoard = computed(() => {
  const center = boardSize.value / 2
  const r = radius.value
  const positionCount: Record<number, number> = {}
  const offsetStep = boardSize.value < 400 ? 9 : 12

  return props.players.map((player) => {
    const cellPos = player.total_score % 100
    const offset = positionCount[cellPos] || 0
    positionCount[cellPos] = offset + 1

    const angle = ((cellPos / 100) * 360 - 90) * (Math.PI / 180)
    const offsetRadius = r + offset * offsetStep - (offset > 0 ? 5 : 0)
    return {
      ...player,
      x: center + offsetRadius * Math.cos(angle),
      y: center + offsetRadius * Math.sin(angle),
    }
  })
})

function cellClass(cell: Cell) {
  if (cell.index === 0) {
    return 'bg-emerald-500/30 border border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
  }
  if (cell.index === 99) {
    return 'bg-amber-500/30 border border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
  }
  if (cell.index % 10 === 0) {
    return 'bg-primary-500/30 border border-primary-400/40 text-primary-200'
  }
  return 'bg-white/5 border border-white/5 text-surface-400 hover:bg-white/10'
}

function handleCellClick(cellIndex: number) {
  const playersOnCell = props.players.filter((p) => (p.total_score % 100) === cellIndex)
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
