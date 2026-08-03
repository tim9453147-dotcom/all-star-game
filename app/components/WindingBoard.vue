<template>
  <div class="w-full h-full max-h-[calc(100dvh-4.25rem)] flex flex-col items-center justify-between px-1 sm:px-2 py-0.5 sm:py-2 select-none overflow-hidden font-sans">
    <!-- Top Header Bar -->
    <div class="w-full max-w-lg sm:max-w-xl flex items-center justify-between mb-1.5 px-2.5 py-1 bg-surface-900/85 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-lg text-xs">
      <div class="flex items-center gap-1.5 font-extrabold text-amber-200">
        <span class="text-sm">🛣️</span>
        <span class="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text text-transparent tracking-wide">
          群星冒險步道 (1-100)
        </span>
        <span class="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300/70 font-normal">
          <span>✨</span><span>一目了然零滾動</span>
        </span>
      </div>

      <div class="flex items-center gap-2 text-[11px]">
        <div class="flex items-center gap-1 bg-surface-800/90 px-2.5 py-0.5 rounded-lg border border-amber-500/20 text-emerald-300 font-medium">
          <span>👥</span>
          <span>{{ players.length }} 勇者</span>
        </div>
        <div class="flex items-center gap-1 bg-surface-800/90 px-2.5 py-0.5 rounded-lg border border-amber-500/20 text-amber-300 font-medium">
          <span>🏆</span>
          <span>{{ topPlayerScore }} 分</span>
        </div>
      </div>
    </div>

    <!-- 10x10 Organic Winding Trail Container (No rectangular boxes, pure winding path) -->
    <div
      ref="boardContainer"
      class="relative w-full max-w-lg sm:max-w-xl aspect-square flex-1 min-h-0 bg-gradient-to-b from-[#090d16] via-[#0e1626] to-[#16122d] border-2 border-amber-500/30 p-2 sm:p-3 rounded-3xl shadow-2xl flex flex-col justify-center overflow-hidden"
    >
      <!-- Background Soft Ambient Glows -->
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <!-- SVG Continuous Thick Winding Road Track (實體步道路徑) -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">
        <defs>
          <linearGradient id="fantasyRoadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#059669" stop-opacity="0.9" />
            <stop offset="30%" stop-color="#4f46e5" stop-opacity="0.9" />
            <stop offset="65%" stop-color="#9333ea" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#d97706" stop-opacity="0.95" />
          </linearGradient>

          <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Thick Outer Road Border / Shadow -->
        <path
          v-if="svgPathD"
          :d="svgPathD"
          fill="none"
          stroke="#050811"
          stroke-width="32"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="opacity-90"
        />

        <!-- Main Physical Winding Trail Body (步道路體) -->
        <path
          v-if="svgPathD"
          :d="svgPathD"
          fill="none"
          stroke="url(#fantasyRoadGradient)"
          stroke-width="22"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#roadGlow)"
          class="opacity-90"
        />

        <!-- Center Lane Dashed Line -->
        <path
          v-if="svgPathD"
          :d="svgPathD"
          fill="none"
          stroke="#ffffff"
          stroke-width="1.8"
          stroke-dasharray="5 5"
          stroke-linecap="round"
          class="opacity-60 animate-pulse"
        />
      </svg>

      <!-- 10x10 Grid Overlay for Circular Stepping Stone Nodes (No rectangular boxes!) -->
      <div class="grid grid-cols-10 grid-rows-10 gap-0.5 sm:gap-1 relative z-10 w-full h-full">
        <div
          v-for="cell in gridCells"
          :id="`tile-${cell.num}`"
          :key="cell.num"
          :ref="(el) => setTileRef(el, cell.num)"
          class="relative w-full h-full flex items-center justify-center bg-transparent border-0 shadow-none select-none overflow-visible"
        >
          <!-- Circular Stepping Stone Node on the Trail (圓形步道點) -->
          <button
            type="button"
            class="relative rounded-full flex items-center justify-center font-extrabold select-none transition-all duration-200 cursor-pointer shadow-md group border focus:outline-none"
            :class="[
              getNodeStyle(cell.num),
              highlightedTile === cell.num ? 'ring-2 sm:ring-4 ring-amber-300 scale-125 z-30 shadow-xl shadow-amber-500/60' : 'hover:scale-120 hover:z-20'
            ]"
            @click="handleTileClick(cell.num)"
          >
            <!-- Special Tile 1: START -->
            <template v-if="cell.num === 1">
              <span class="text-[9px] sm:text-xs leading-none">🚩</span>
            </template>

            <!-- Special Tile 100: FINISH -->
            <template v-else-if="cell.num === TOTAL_TILES">
              <span class="text-[10px] sm:text-sm animate-bounce leading-none">🏆</span>
            </template>

            <!-- Regular Node Number -->
            <template v-else>
              <span class="text-[7px] sm:text-[10px] font-mono font-black opacity-95 leading-none">{{ cell.num }}</span>
            </template>
          </button>

          <!-- Player Avatars Badge Stack on Node -->
          <div
            v-if="cellPlayers(cell.num).length > 0"
            class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex -space-x-1 sm:-space-x-1.5 z-30 pointer-events-auto"
          >
            <PlayerAvatar
              v-for="player in cellPlayers(cell.num).slice(0, 2)"
              :key="player.id"
              :avatar="player.avatar"
              :name="player.name"
              size="xs"
              shape="circle"
              :border="true"
              class="w-4 h-4 sm:w-5.5 sm:h-5.5 transform transition-transform hover:scale-125 cursor-pointer shadow-lg ring-1 ring-amber-300"
              :title="`${player.name} (${player.total_score}分)`"
              @click.stop="handleTileClick(cell.num)"
            />
            <div
              v-if="cellPlayers(cell.num).length > 2"
              class="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-surface-900 border border-amber-300 flex items-center justify-center text-[6px] sm:text-[8px] font-bold text-amber-300 shadow"
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
import PlayerAvatar from './PlayerAvatar.vue'

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

const COLS = 10
const ROWS = 10
const TOTAL_TILES = COLS * ROWS // 100 tiles

const boardContainer = ref<HTMLElement | null>(null)
const tileRefs = ref<Record<number, HTMLElement>>({})
const highlightedTile = ref<number | null>(null)
const svgPathD = ref('')

const topPlayerScore = computed(() => {
  if (!props.players.length) return 0
  return Math.max(...props.players.map((p) => p.total_score || 0))
})

/**
 * Compute 10-column x 10-row Serpentine S-Grid cells for numbers 1 to 100
 * Matches 地圖.pdf serpentine track:
 * - Tile 1 is at bottom right (level 0, column 9)
 * - Tile 10 is at bottom left (level 0, column 0)
 * - Tile 11 is at level 1, column 0 -> Tile 20 at level 1, column 9
 * - ...
 * - Tile 100 is at top right (level 9, column 9)
 */
const gridCells = computed(() => {
  const result = []
  for (let r = 0; r < ROWS; r++) {
    const level = ROWS - 1 - r // 0 at bottom row, 9 at top row
    for (let c = 0; c < COLS; c++) {
      let serpentineNum: number
      if (level % 2 === 0) {
        // Even level (0, 2, 4, 6, 8): right to left
        serpentineNum = level * COLS + (COLS - 1 - c) + 1
      } else {
        // Odd level (1, 3, 5, 7, 9): left to right
        serpentineNum = level * COLS + c + 1
      }
      result.push({ num: serpentineNum, row: r, col: c })
    }
  }
  return result
})

function setTileRef(el: any, num: number) {
  if (el) {
    tileRefs.value[el.id ? parseInt(el.id.replace('tile-', ''), 10) : num] = el as HTMLElement
  }
}

// Convert player score to cell 1..100
function getPlayerTileNumber(score: number): number {
  if (score <= 0) return 1
  if (score >= TOTAL_TILES) return TOTAL_TILES
  return score
}

function cellPlayers(tileNum: number) {
  return props.players.filter((p) => getPlayerTileNumber(p.total_score) === tileNum)
}

function getNodeStyle(num: number) {
  if (num === 1) {
    return 'w-6 h-6 sm:w-8.5 sm:h-8.5 bg-emerald-500 border-2 border-emerald-200 text-white shadow-emerald-500/60'
  }
  if (num === TOTAL_TILES) {
    return 'w-7 h-7 sm:w-9 sm:h-9 bg-amber-400 border-2 border-yellow-100 text-surface-950 shadow-amber-400/70 animate-bounce'
  }
  // Circular stepping stone node sitting on top of the physical winding trail
  return 'w-5.5 h-5.5 sm:w-7 sm:h-7 bg-surface-900/95 border-2 border-amber-400/60 text-amber-200 shadow-md hover:bg-amber-400 hover:text-surface-950 hover:border-white'
}

function handleTileClick(num: number) {
  highlightedTile.value = num
  const playersOnCell = cellPlayers(num)
  emit('select-tile', { tileNum: num, players: playersOnCell })
}

// Calculate SVG Bezier S-Path between node centers (1 -> 2 -> ... -> 100)
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





