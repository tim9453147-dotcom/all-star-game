<template>
  <div class="py-8">
    <!-- Hero Section -->
    <div class="text-center mb-10">
      <h1 class="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-accent-400 via-accent-300 to-primary-400 bg-clip-text text-transparent">
        積分大富翁
      </h1>
      <p class="text-surface-400 text-lg">完成任務累積積分，在棋盤上前進！</p>
    </div>

    <!-- Board Section -->
    <div class="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto px-4">
      <!-- Circular Board -->
      <div class="flex-1 flex justify-center">
        <div class="relative" :style="{ width: boardSize + 'px', height: boardSize + 'px' }">
          <!-- Board Ring Background -->
          <div class="absolute inset-0 rounded-full border-2 border-primary-800/30" />
          <div
            class="absolute rounded-full border border-primary-700/20"
            :style="{
              top: (boardSize / 2 - radius - 18) + 'px',
              left: (boardSize / 2 - radius - 18) + 'px',
              width: (radius + 18) * 2 + 'px',
              height: (radius + 18) * 2 + 'px',
            }"
          />
          <div
            class="absolute rounded-full border border-primary-700/20"
            :style="{
              top: (boardSize / 2 - radius + 18) + 'px',
              left: (boardSize / 2 - radius + 18) + 'px',
              width: (radius - 18) * 2 + 'px',
              height: (radius - 18) * 2 + 'px',
            }"
          />

          <!-- Center Info -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-5xl mb-2">🎲</div>
              <div class="text-sm text-surface-400">共 {{ players.length }} 位玩家</div>
            </div>
          </div>

          <!-- Cells -->
          <div
            v-for="cell in cells"
            :key="cell.index"
            class="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-md flex items-center justify-center text-[9px] font-bold transition-all duration-300 cursor-default"
            :class="cellClass(cell)"
            :style="{ top: cell.y + 'px', left: cell.x + 'px' }"
            :title="'格子 ' + cell.index"
          >
            <span v-if="cell.index === 0" class="text-xs">GO</span>
            <span v-else-if="cell.index % 10 === 0">{{ cell.index }}</span>
            <span v-else-if="cell.isMilestone">🎁</span>
          </div>

          <!-- Player Tokens -->
          <div
            v-for="(player, pi) in playersOnBoard"
            :key="player.id"
            class="absolute -ml-5 -mt-5 group z-10"
            :style="{ top: player.y + 'px', left: player.x + 'px' }"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-transform duration-300 hover:scale-125 cursor-pointer animate-pulse-slow border-2"
              :class="tokenColors[pi % tokenColors.length]"
              :style="{ animationDelay: pi * 0.3 + 's' }"
            >
              {{ player.name.charAt(0) }}
            </div>
            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-800 border border-white/10 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20">
              <div class="font-bold text-white">{{ player.name }}</div>
              <div class="text-accent-400">{{ player.total_score }} 分</div>
              <div class="text-surface-400">第 {{ Math.floor(player.total_score / 100) }} 圈 · 格子 {{ player.total_score % 100 }}</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-surface-800 border-r border-b border-white/10 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="xl:w-80 shrink-0">
        <div class="bg-surface-800/50 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            🏆 <span>排行榜</span>
          </h2>
          <div v-if="players.length === 0" class="text-center text-surface-400 py-8">
            還沒有玩家加入
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(player, index) in players"
              :key="player.id"
              class="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
              :class="index < 3 ? 'bg-white/5' : ''"
            >
              <!-- Rank -->
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                :class="{
                  'bg-yellow-500/20 text-yellow-400': index === 0,
                  'bg-surface-400/20 text-surface-300': index === 1,
                  'bg-amber-700/20 text-amber-600': index === 2,
                  'bg-surface-700/50 text-surface-400': index > 2,
                }"
              >
                {{ index < 3 ? ['🥇','🥈','🥉'][index] : index + 1 }}
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm truncate">{{ player.name }}</div>
                <div class="text-xs text-surface-400">格子 {{ player.total_score % 100 }} · 第 {{ Math.floor(player.total_score / 100) }} 圈</div>
              </div>
              <!-- Score -->
              <div class="text-right shrink-0">
                <div class="text-sm font-bold text-accent-400">{{ player.total_score }}</div>
                <div class="text-xs text-surface-500">分</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rewards Preview -->
        <div class="mt-6 bg-surface-800/50 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            🎁 <span>獎勵里程碑</span>
          </h2>
          <div class="space-y-3">
            <div
              v-for="reward in rewards"
              :key="reward.id"
              class="flex items-center gap-3 p-3 rounded-xl"
              :class="highestScore >= reward.points_required ? 'bg-accent-500/10 border border-accent-500/20' : 'bg-white/5'"
            >
              <div class="text-2xl">{{ highestScore >= reward.points_required ? '🎉' : '🔒' }}</div>
              <div class="flex-1">
                <div class="text-sm font-semibold">{{ reward.name }}</div>
                <div class="text-xs text-surface-400">{{ reward.points_required }} 分解鎖</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
const highestScore = computed(() => players.value.length > 0 ? players.value[0].total_score : 0)

const boardSize = ref(600)
const radius = computed(() => boardSize.value / 2 - 40)

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

  return players.value.map((player, pi) => {
    const cellPos = player.total_score % 100
    const offset = positionCount[cellPos] || 0
    positionCount[cellPos] = offset + 1

    const angle = ((cellPos / 100) * 360 - 90) * (Math.PI / 180)
    const offsetRadius = r + (offset * 14) - (offset > 0 ? 7 : 0)
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
</style>
