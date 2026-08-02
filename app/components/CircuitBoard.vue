<template>
  <div class="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4">
    <!-- Header -->
    <div class="mb-4 text-center">
      <span class="text-xs font-mono text-cyan-400 tracking-widest uppercase">PANORAMA VIEW 03</span>
      <h3 class="text-lg sm:text-2xl font-black text-white flex items-center justify-center gap-2">
        <span>🏎️</span> 折線賽車場全景賽道
      </h3>
      <p class="text-xs text-surface-400 mt-0.5">5 條雙向高速跑道與迴轉彎道的 100 格競速賽道</p>
    </div>

    <!-- Circuit Container -->
    <div class="bg-surface-900/80 backdrop-blur-2xl border border-white/15 p-3 sm:p-6 rounded-3xl shadow-2xl overflow-x-auto scrollbar-none">
      <div class="min-w-[340px] flex flex-col gap-4 sm:gap-6 py-2">
        <div
          v-for="(lane, lIndex) in circuitLanes"
          :key="lIndex"
          class="relative flex items-center gap-1.5 sm:gap-2 justify-between bg-surface-800/40 p-2 sm:p-3 rounded-2xl border border-white/5"
        >
          <!-- Lane Number Pill -->
          <div class="absolute -left-2 top-1/2 -translate-y-1/2 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[9px] font-mono px-1.5 py-0.5 rounded-md shadow">
            L{{ lIndex + 1 }}
          </div>

          <!-- Tiles in Lane -->
          <div
            v-for="tileIndex in lane"
            :key="tileIndex"
            class="relative flex-1 aspect-square rounded-xl flex flex-col items-center justify-center font-extrabold text-[10px] sm:text-xs select-none transition-all duration-200 cursor-pointer border shadow-sm group hover:scale-110 hover:z-20"
            :class="[
              getTileStyle(tileIndex),
              highlightedTile === tileIndex ? 'ring-2 ring-amber-400 scale-110 z-20' : ''
            ]"
            @click="handleTileClick(tileIndex)"
          >
            <span v-if="tileIndex === 0" class="font-black text-emerald-300 text-[8px] sm:text-[10px]">START</span>
            <span v-else-if="tileIndex === 99" class="text-xs sm:text-sm">🏁</span>
            <span v-else-if="tileIndex % 10 === 0" class="font-black text-amber-400">{{ tileIndex }}</span>
            <span v-else class="opacity-80 font-mono text-[9px] sm:text-xs">{{ tileIndex }}</span>

            <!-- Players Avatar Stack -->
            <div
              v-if="cellPlayers(tileIndex).length > 0"
              class="absolute -top-1.5 -right-1.5 flex -space-x-1 z-30"
            >
              <div
                v-for="player in cellPlayers(tileIndex).slice(0, 2)"
                :key="player.id"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white shadow-md border border-white/60"
                :class="getPlayerColor(player.id)"
                :title="player.player_id"
                @click.stop="$emit('select-player', player)"
              >
                {{ player.player_id.charAt(0).toUpperCase() }}
              </div>
              <div
                v-if="cellPlayers(tileIndex).length > 2"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-surface-900 border border-white/60 flex items-center justify-center text-[7px] font-bold text-white shadow"
              >
                +{{ cellPlayers(tileIndex).length - 2 }}
              </div>
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

const highlightedTile = ref<number | null>(null)

// 5 lanes x 20 tiles per lane
const circuitLanes = computed(() => {
  const lanes = []
  for (let l = 0; l < 5; l++) {
    const lane = []
    for (let c = 0; c < 20; c++) {
      const idx = l % 2 === 0 ? l * 20 + c : l * 20 + (19 - c)
      lane.push(idx)
    }
    lanes.push(lane)
  }
  return lanes
})

function cellPlayers(cellIndex: number) {
  return props.players.filter((p) => (p.total_score % 100) === cellIndex)
}

function getTileStyle(index: number) {
  if (index === 0) return 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
  if (index === 99) return 'bg-amber-500/40 border-amber-400 text-amber-300 shadow-amber-500/30'
  if (index % 10 === 0) return 'bg-cyan-500/30 border-cyan-400/50 text-cyan-200 shadow-cyan-500/20'
  return 'bg-surface-800/80 border-white/10 text-surface-300 hover:bg-surface-700 hover:border-cyan-400/40'
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

function handleTileClick(index: number) {
  highlightedTile.value = index
  const playersOnCell = cellPlayers(index)
  if (playersOnCell.length > 0) {
    emit('select-player', playersOnCell[0])
  }
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
