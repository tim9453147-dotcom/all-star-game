<template>
  <div class="py-4 sm:py-8 px-2 sm:px-4 max-w-7xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-6 sm:mb-10 px-2">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-accent-400 via-accent-300 to-primary-400 bg-clip-text text-transparent">
        積分大富翁
      </h1>
      <p class="text-surface-400 text-sm sm:text-lg">完成任務累積積分，在棋盤上前進！</p>
    </div>

    <!-- Mobile View Switcher Tabs -->
    <div class="flex xl:hidden justify-center mb-6 px-2">
      <div class="bg-surface-800/80 p-1 rounded-2xl border border-white/10 flex gap-1 w-full max-w-xs shadow-lg">
        <button
          class="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="activeMobileTab === 'board' ? 'bg-primary-600 text-white shadow-md' : 'text-surface-400 hover:text-white'"
          @click="activeMobileTab = 'board'"
        >
          <span>🎲 棋盤</span>
        </button>
        <button
          class="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="activeMobileTab === 'rank' ? 'bg-accent-600 text-white shadow-md' : 'text-surface-400 hover:text-white'"
          @click="activeMobileTab = 'rank'"
        >
          <span>🏆 排行與獎勵</span>
        </button>
      </div>
    </div>

    <!-- Board & Info Layout -->
    <div class="flex flex-col xl:flex-row gap-6 sm:gap-8 items-center xl:items-start justify-center">
      <!-- Circular Board Container -->
      <div
        v-show="activeMobileTab === 'board' || isDesktop"
        class="w-full flex-1 flex flex-col items-center justify-center overflow-hidden py-2"
      >
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

          <!-- Center Info -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="text-center select-none transform scale-90 sm:scale-100">
              <div class="text-4xl sm:text-5xl mb-1 animate-bounce-slow">🎲</div>
              <div class="text-xs sm:text-sm font-semibold text-surface-300">共 {{ players.length }} 位玩家</div>
              <div class="text-[10px] text-surface-500 mt-1">100格 環形棋盤</div>
            </div>
          </div>

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
            <span v-else-if="cell.isMilestone" class="text-[10px] sm:text-xs">🎁</span>
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

      <!-- Leaderboard & Rewards Column -->
      <div
        v-show="activeMobileTab === 'rank' || isDesktop"
        class="w-full xl:w-80 shrink-0 space-y-6"
      >
        <!-- Leaderboard -->
        <div class="bg-surface-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 class="text-base sm:text-lg font-extrabold mb-4 flex items-center justify-between">
            <span class="flex items-center gap-2">🏆 <span>排行榜</span></span>
            <span class="text-xs text-surface-400 font-normal">依總積分排序</span>
          </h2>
          <div v-if="players.length === 0" class="text-center text-surface-400 py-8 text-sm">
            還沒有玩家加入
          </div>
          <div v-else class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            <div
              v-for="(player, index) in players"
              :key="player.id"
              class="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all hover:bg-white/10 cursor-pointer active:bg-white/15"
              :class="index < 3 ? 'bg-white/5 border border-white/5' : ''"
              @click="selectPlayer(player)"
            >
              <!-- Rank -->
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 shadow-sm"
                :class="{
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30': index === 0,
                  'bg-slate-400/20 text-slate-200 border border-slate-400/30': index === 1,
                  'bg-amber-700/20 text-amber-500 border border-amber-700/30': index === 2,
                  'bg-surface-700/50 text-surface-400': index > 2,
                }"
              >
                {{ index < 3 ? ['🥇','🥈','🥉'][index] : index + 1 }}
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-xs sm:text-sm truncate text-white">{{ player.name }}</div>
                <div class="text-[11px] text-surface-400">格子 {{ player.total_score % 100 }} · 第 {{ Math.floor(player.total_score / 100) }} 圈</div>
              </div>
              <!-- Score -->
              <div class="text-right shrink-0">
                <div class="text-sm sm:text-base font-black text-accent-400">{{ player.total_score }}</div>
                <div class="text-[10px] text-surface-500">分</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rewards Preview -->
        <div class="bg-surface-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 class="text-base sm:text-lg font-extrabold mb-4 flex items-center justify-between">
            <span class="flex items-center gap-2">🎁 <span>獎勵里程碑</span></span>
            <NuxtLink to="/rewards" class="text-xs text-primary-400 hover:underline">全覽 →</NuxtLink>
          </h2>
          <div class="space-y-2.5">
            <div
              v-for="reward in rewards"
              :key="reward.id"
              class="flex items-center gap-3 p-3 rounded-xl transition-all"
              :class="highestScore >= reward.points_required ? 'bg-accent-500/10 border border-accent-500/30' : 'bg-white/5 border border-white/5'"
            >
              <div class="text-2xl shrink-0">{{ highestScore >= reward.points_required ? '🎉' : '🔒' }}</div>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm font-bold truncate text-white">{{ reward.name }}</div>
                <div class="text-[11px] text-surface-400">{{ reward.points_required }} 分解鎖</div>
              </div>
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

interface Reward {
  id: number
  points_required: number
  name: string
}

const { data: playersData } = await useFetch<Player[]>('/api/players')
const { data: rewardsData } = await useFetch<Reward[]>('/api/rewards')

const players = computed(() => playersData.value || [])
const rewards = computed(() => rewardsData.value || [])
const highestScore = computed(() => players.value[0]?.total_score ?? 0)

const activeMobileTab = ref<'board' | 'rank'>('board')
const selectedPlayer = ref<Player | null>(null)

function selectPlayer(p: Player) {
  selectedPlayer.value = p
}

// Responsive Board Sizing
const windowWidth = ref(1024)
const isDesktop = computed(() => windowWidth.value >= 1280)

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

const milestonePositions = computed(() => {
  return new Set(rewards.value.map(r => r.points_required % 100))
})

interface Cell {
  index: number
  x: number
  y: number
  isMilestone: boolean
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
      isMilestone: milestonePositions.value.has(i) && i !== 0,
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
  if (cell.isMilestone) {
    return 'bg-accent-500/20 border border-accent-400/30 text-accent-300 shadow-md shadow-accent-500/20 animate-pulse-slow'
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
  title: '積分大富翁 - 棋盤',
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

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

