<template>
  <div class="w-full max-w-lg mx-auto px-1 sm:px-2 flex flex-col items-center">
    <!-- 7 Columns S-Serpentine Map Container (7 x 14 Grid = 98 Tiles) -->
    <div
      ref="boardContainer"
      class="relative w-full bg-surface-900/90 backdrop-blur-2xl border border-white/15 p-2.5 sm:p-4 rounded-3xl shadow-2xl"
    >
      <!-- SVG Continuous S-Track Glowing Line Layer -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">
        <defs>
          <linearGradient id="sTrackGradient7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.85" />
            <stop offset="50%" stop-color="#a855f7" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0.85" />
          </linearGradient>
          <filter id="neonGlowS7" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- S-Track Path -->
        <path
          v-if="svgPathD"
          :d="svgPathD"
          fill="none"
          stroke="url(#sTrackGradient7)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#neonGlowS7)"
          class="opacity-80"
        />
        <path
          v-if="svgPathD"
          :d="svgPathD"
          fill="none"
          stroke="#ffffff"
          stroke-width="1.5"
          stroke-dasharray="5 5"
          stroke-linecap="round"
          class="opacity-45 animate-pulse"
        />
      </svg>

      <!-- 7 Columns Grid (Tiles 1 to 98) -->
      <div class="grid grid-cols-7 gap-1 sm:gap-2 relative z-10 w-full">
        <div
          v-for="cell in gridCells"
          :id="`tile-${cell.num}`"
          :key="cell.num"
          :ref="(el) => setTileRef(el, cell.num)"
          class="relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-extrabold select-none transition-all duration-200 cursor-pointer shadow-md border hover:scale-110 group p-0.5"
          :class="[
            getCellStyle(cell.num),
            highlightedTile === cell.num ? 'ring-4 ring-amber-400 scale-110 z-30' : ''
          ]"
          @click="handleTileClick(cell.num)"
        >
          <!-- Cell Number / Icon -->
          <template v-if="cell.num === 1">
            <span class="text-[10px] sm:text-xs font-black text-emerald-300">1</span>
            <span class="text-[6px] sm:text-[8px] text-emerald-400 font-bold tracking-tight">START</span>
          </template>

          <template v-else-if="cell.num === TOTAL_TILES">
            <span class="text-[10px] sm:text-xs">🏆</span>
            <span class="text-[7px] sm:text-[9px] text-amber-300 font-black">{{ TOTAL_TILES }}</span>
          </template>

          <template v-else>
            <span class="text-[10px] sm:text-xs font-mono font-bold opacity-85">{{ cell.num }}</span>
          </template>

          <!-- Player Avatars Badge Stack -->
          <div
            v-if="cellPlayers(cell.num).length > 0"
            class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex -space-x-1.5 z-30"
          >
            <PlayerAvatar
              v-for="player in cellPlayers(cell.num).slice(0, 2)"
              :key="player.id"
<<<<<<< Updated upstream
              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white shadow-lg border border-white/60"
              :class="getPlayerColor(player.id)"
              :title="player.player_id"
              @click.stop="handleTileClick(cell.num)"
            >
              {{ player.player_id.charAt(0).toUpperCase() }}
            </div>
=======
              :avatar="player.avatar"
              :name="player.name"
              size="xs"
              shape="circle"
              :border="true"
              class="transform transition-transform hover:scale-125 cursor-pointer shadow-md"
              :title="player.name"
              @click.stop="$emit('select-player', player)"
            />
>>>>>>> Stashed changes
            <div
              v-if="cellPlayers(cell.num).length > 2"
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface-900 border border-white/80 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white shadow"
            >
              +{{ cellPlayers(cell.num).length - 2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

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
  (e: 'select-tile', payload: { tileNum: number; players: Player[] }): void
}>()

const COLS = 7
const ROWS = 14
const TOTAL_TILES = COLS * ROWS // 98 tiles

const boardContainer = ref<HTMLElement | null>(null)
const tileRefs = ref<Record<number, HTMLElement>>({})
const highlightedTile = ref<number | null>(null)
const svgPathD = ref('')

// Compute 7-column x 14-row Serpentine S-Grid cells for numbers 1 to 98
const gridCells = computed(() => {
  const result = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const serpentineNum = r % 2 === 0
        ? r * COLS + c + 1
        : r * COLS + (COLS - 1 - c) + 1
      result.push({ num: serpentineNum, row: r, col: c })
    }
  }
  return result
})

function setTileRef(el: any, num: number) {
  if (el) {
    tileRefs.value[num] = el as HTMLElement
  }
}

// Convert player score to cell 1..98
function getPlayerTileNumber(score: number): number {
  if (score <= 0) return 1
  const pos = score % TOTAL_TILES
  return pos === 0 ? TOTAL_TILES : pos
}

function cellPlayers(tileNum: number) {
  return props.players.filter((p) => getPlayerTileNumber(p.total_score) === tileNum)
}

function getCellStyle(num: number) {
  if (num === 1) {
    return 'bg-gradient-to-br from-emerald-500/40 to-teal-700/50 border-2 border-emerald-400 text-emerald-200 shadow-emerald-500/30'
  }
  if (num === TOTAL_TILES) {
    return 'bg-gradient-to-br from-amber-500/50 via-purple-600/40 to-rose-600/50 border-2 border-amber-400 text-amber-200 shadow-amber-500/40'
  }
  return 'bg-surface-800/80 border border-white/10 text-surface-200 hover:bg-surface-700 hover:border-white/30'
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

function handleTileClick(num: number) {
  highlightedTile.value = num
  const playersOnCell = cellPlayers(num)
  emit('select-tile', { tileNum: num, players: playersOnCell })
}

// Calculate SVG Smooth Bezier S-Path between cells (1 -> 2 -> ... -> 98)
function updateSVGPath() {
  if (!boardContainer.value) return
  const containerRect = boardContainer.value.getBoundingClientRect()
  const points: { x: number; y: number }[] = []

  for (let i = 1; i <= TOTAL_TILES; i++) {
    const el = tileRefs.value[i]
    if (el) {
      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2 - containerRect.left
      const y = rect.top + rect.height / 2 - containerRect.top
      points.push({ x, y })
    }
  }

  if (points.length < 2) return

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y

    const cp1x = p1.x + dx * 0.5
    const cp1y = p1.y
    const cp2x = p1.x + dx * 0.5
    const cp2y = p2.y

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  svgPathD.value = d
}

function updateWindowSize() {
  if (typeof window !== 'undefined') {
    nextTick(() => {
      setTimeout(updateSVGPath, 150)
    })
  }
}

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
  nextTick(() => {
    setTimeout(updateSVGPath, 300)
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowSize)
  }
})
</script>

