<template>
  <div class="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4">
    <!-- Header -->
    <div class="mb-4 text-center">
      <span class="text-xs font-mono text-emerald-400 tracking-widest uppercase">PANORAMA VIEW 02</span>
      <h3 class="text-lg sm:text-2xl font-black text-white flex items-center justify-center gap-2">
        <span>⬡</span> 蜂巢生態冒險全景圖
      </h3>
      <p class="text-xs text-surface-400 mt-0.5">跨越 6 大生態地形的 100 格六角蜂巢大地圖</p>
    </div>

    <!-- Hex Map Legend Bar -->
    <div class="mb-4 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs font-semibold">
      <span
        v-for="b in biomes"
        :key="b.name"
        class="px-2.5 py-1 rounded-full border backdrop-blur flex items-center gap-1"
        :class="b.tagClass"
      >
        <span>{{ b.icon }}</span>
        <span>{{ b.name }} ({{ b.range }})</span>
      </span>
    </div>

    <!-- Hex Grid Container -->
    <div class="bg-surface-900/70 backdrop-blur-2xl border border-white/10 p-3 sm:p-5 rounded-3xl shadow-2xl overflow-x-auto scrollbar-none">
      <div class="min-w-[320px] flex flex-col items-center gap-1 sm:gap-1.5 py-2">
        <div
          v-for="(row, rIndex) in hexRows"
          :key="rIndex"
          class="flex items-center justify-center gap-1 sm:gap-1.5"
          :class="rIndex % 2 === 1 ? 'ml-3 sm:ml-5' : ''"
        >
          <div
            v-for="tileIndex in row"
            :key="tileIndex"
            class="relative w-8 h-8 sm:w-11 sm:h-11 flex flex-col items-center justify-center font-extrabold text-[10px] sm:text-xs select-none transition-all duration-300 cursor-pointer clip-hexagon border border-white/10 shadow-md group hover:scale-110 hover:z-20"
            :class="[
              getHexStyle(tileIndex),
              highlightedTile === tileIndex ? 'ring-2 ring-amber-400 scale-125 z-30' : ''
            ]"
            @click="handleTileClick(tileIndex)"
          >
            <!-- Cell Content -->
            <span v-if="tileIndex === 0" class="font-black text-emerald-300 text-[8px] sm:text-[10px]">START</span>
            <span v-else-if="tileIndex === 99" class="text-xs sm:text-sm">👑</span>
            <span v-else-if="tileIndex % 10 === 0" class="font-black text-amber-300">{{ tileIndex }}</span>
            <span v-else class="opacity-80 font-mono text-[9px] sm:text-xs">{{ tileIndex }}</span>

            <!-- Players Stack -->
            <div
              v-if="cellPlayers(tileIndex).length > 0"
              class="absolute -top-1 -right-1 flex -space-x-1 z-30"
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

const biomes = [
  { name: '綠意草原', range: '0-19', icon: '🍃', tagClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
  { name: '黃金沙漠', range: '20-39', icon: '🏜️', tagClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300' },
  { name: '深海湛藍', range: '40-59', icon: '🌊', tagClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  { name: '水晶谷地', range: '60-79', icon: '💎', tagClass: 'bg-purple-500/15 border-purple-500/30 text-purple-300' },
  { name: '烈焰火山', range: '80-89', icon: '🌋', tagClass: 'bg-rose-500/15 border-rose-500/30 text-rose-300' },
  { name: '天空之城', range: '90-99', icon: '👑', tagClass: 'bg-yellow-400/20 border-yellow-400/40 text-yellow-200' },
]

// 10 rows of 10 cells in snake order
const hexRows = computed(() => {
  const rows = []
  for (let r = 0; r < 10; r++) {
    const row = []
    for (let c = 0; c < 10; c++) {
      const idx = r % 2 === 0 ? r * 10 + c : r * 10 + (9 - c)
      row.push(idx)
    }
    rows.push(row)
  }
  return rows
})

function cellPlayers(cellIndex: number) {
  return props.players.filter((p) => (p.total_score % 100) === cellIndex)
}

function getHexStyle(index: number) {
  if (index === 0) return 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/30'
  if (index === 99) return 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-amber-500/40'

  if (index < 20) return 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/80'
  if (index < 40) return 'bg-amber-950/80 border-amber-500/30 text-amber-300 hover:bg-amber-800/80'
  if (index < 60) return 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300 hover:bg-cyan-800/80'
  if (index < 80) return 'bg-purple-950/80 border-purple-500/30 text-purple-300 hover:bg-purple-800/80'
  if (index < 90) return 'bg-rose-950/80 border-rose-500/30 text-rose-300 hover:bg-rose-800/80'
  return 'bg-gradient-to-br from-yellow-500/30 to-amber-600/30 border-yellow-400/40 text-yellow-200'
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
.clip-hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
