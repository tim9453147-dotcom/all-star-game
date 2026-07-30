<template>
  <div class="py-4 sm:py-8 px-2 sm:px-4 max-w-7xl mx-auto">
    <!-- Board Layout -->
    <div class="flex items-center justify-center">
      <!-- Circular Board Container -->
      <div class="w-full flex-1 flex flex-col items-center justify-center overflow-hidden py-2">
        <!-- Board Wrapper -->
        <div
          ref="boardWrapper"
          class="relative flex items-center justify-center transition-all duration-300 touch-pan-x touch-pan-y"
          :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
        >
          <!-- Board Ring Background -->
          <div class="absolute inset-0 rounded-full border-2 border-primary-800/30 shadow-inner" />
          <div
            class="absolute rounded-full border border-primary-700/20"
            :style="{
              top: (boardSize / 2 - radius - 14) + 'px',
              left: (boardSize / 2 - radius - 14) + 'px',
              width: (radius + 14) * 2 + 'px',
              height: (radius + 14) * 2 + 'px',
            }"
          />
          <div
            class="absolute rounded-full border border-primary-700/20"
            :style="{
              top: (boardSize / 2 - radius + 14) + 'px',
              left: (boardSize / 2 - radius + 14) + 'px',
              width: (radius - 14) * 2 + 'px',
              height: (radius - 14) * 2 + 'px',
            }"
          />

          <!-- Cells -->
          <div
            v-for="cell in cells"
            :key="cell.index"
            class="absolute rounded-md flex items-center justify-center font-bold transition-all duration-300 select-none"
            :class="[cellClass(cell), cellSizeClass]"
            :style="{ top: cell.y + 'px', left: cell.x + 'px' }"
            :title="'格子 ' + cell.index"
          >
            <span v-if="cell.index === 0" class="text-[10px] sm:text-xs">GO</span>
            <span v-else-if="cell.index % 10 === 0">{{ cell.index }}</span>
          </div>

          <!-- Player Tokens -->
          <div
            v-for="(player, pi) in playersOnBoard"
            :key="player.id"
            class="absolute group z-10 cursor-pointer"
            :class="playerTokenSizeClass"
            :style="{ top: player.y + 'px', left: player.x + 'px' }"
            @click="selectPlayer(player)"
          >
            <div
              class="w-full h-full rounded-full flex items-center justify-center font-black shadow-xl transition-all duration-300 hover:scale-125 border-2 active:scale-110"
              :class="[tokenColors[pi % tokenColors.length], tokenFontSizeClass]"
            >
              {{ player.name.charAt(0) }}
            </div>

            <!-- Desktop Tooltip -->
            <div class="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-800/95 backdrop-blur border border-white/10 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-30">
              <div class="font-bold text-white">{{ player.name }}</div>
              <div class="text-accent-400 font-semibold">{{ player.total_score }} 分</div>
              <div class="text-surface-400">第 {{ Math.floor(player.total_score / 100) }} 圈 · 格子 {{ player.total_score % 100 }}</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-surface-800 border-r border-b border-white/10 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Player Details Bottom Sheet Modal -->
    <Teleport to="body">
      <div v-if="selectedPlayer" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="selectedPlayer = null" />

        <!-- Sheet Modal Content -->
        <div class="relative w-full sm:max-w-md bg-surface-800 border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 animate-slide-up">
          <div class="w-12 h-1.5 bg-surface-600 rounded-full mx-auto mb-5 sm:hidden" />

          <button
            class="absolute top-4 right-4 text-surface-400 hover:text-white p-2 rounded-full hover:bg-white/10"
            @click="selectedPlayer = null"
          >
            ✕
          </button>

          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {{ selectedPlayer.name.charAt(0) }}
            </div>
            <div>
              <h3 class="text-xl font-extrabold text-white">{{ selectedPlayer.name }}</h3>
              <p class="text-xs text-surface-400 font-mono">ID: {{ selectedPlayer.player_id }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-surface-700/50 border border-white/5 rounded-2xl p-3.5 text-center">
              <div class="text-xs text-surface-400 mb-1">目前總積分</div>
              <div class="text-2xl font-black text-accent-400">{{ selectedPlayer.total_score }}</div>
            </div>
            <div class="bg-surface-700/50 border border-white/5 rounded-2xl p-3.5 text-center">
              <div class="text-xs text-surface-400 mb-1">棋盤位置</div>
              <div class="text-lg font-bold text-primary-300">
                第 {{ Math.floor(selectedPlayer.total_score / 100) }} 圈 · 格子 {{ selectedPlayer.total_score % 100 }}
              </div>
            </div>
          </div>

          <button
            class="w-full py-3 bg-surface-700 hover:bg-surface-600 rounded-xl font-bold text-sm transition"
            @click="selectedPlayer = null"
          >
            關閉
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Player {
  id: number
  player_id: string
  name: string
  total_score: number
  status: string
}

const { data: playersData } = await useFetch<Player[]>('/api/players')

const players = computed(() => playersData.value || [])
const selectedPlayer = ref<Player | null>(null)

function selectPlayer(p: Player) {
  selectedPlayer.value = p
}

// Responsive Board Sizing
const windowWidth = ref(1024)

const boardSize = computed(() => {
  if (windowWidth.value < 400) {
    return Math.max(300, windowWidth.value - 32)
  } else if (windowWidth.value < 640) {
    return Math.min(windowWidth.value - 40, 420)
  } else if (windowWidth.value < 1024) {
    return 520
  }
  return 580
})

const radius = computed(() => boardSize.value / 2 - (boardSize.value < 400 ? 28 : 36))

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
  'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400/50',
  'bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400/50',
  'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400/50',
  'bg-gradient-to-br from-purple-500 to-violet-600 border-purple-400/50',
  'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/50',
  'bg-gradient-to-br from-teal-500 to-cyan-600 border-teal-400/50',
  'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-400/50',
  'bg-gradient-to-br from-red-500 to-rose-600 border-red-400/50',
]

const playersOnBoard = computed(() => {
  const center = boardSize.value / 2
  const r = radius.value
  const positionCount: Record<number, number> = {}
  const offsetStep = boardSize.value < 400 ? 9 : 12

  return players.value.map((player, pi) => {
    const cellPos = player.total_score % 100
    const offset = positionCount[cellPos] || 0
    positionCount[cellPos] = offset + 1

    const angle = ((cellPos / 100) * 360 - 90) * (Math.PI / 180)
    const offsetRadius = r + (offset * offsetStep) - (offset > 0 ? 5 : 0)
    return {
      ...player,
      x: center + offsetRadius * Math.cos(angle),
      y: center + offsetRadius * Math.sin(angle),
    }
  })
})

function cellClass(cell: Cell) {
  if (cell.index === 0) {
    return 'bg-green-500/30 border border-green-400/50 text-green-300 shadow-lg shadow-green-500/20'
  }
  if (cell.index % 10 === 0) {
    return 'bg-primary-500/20 border border-primary-400/20 text-primary-300'
  }
  return 'bg-white/5 border border-white/5 text-surface-500 hover:bg-white/10'
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

useHead({
  title: 'All-Star',
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

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
