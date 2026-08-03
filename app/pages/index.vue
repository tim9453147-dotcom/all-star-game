<template>
  <div class="py-3 sm:py-6 px-2 sm:px-4 max-w-5xl mx-auto flex flex-col items-center">
    <!-- Pure S-shaped Serpentine Board -->
    <WindingBoard
      :players="players"
      @select-tile="handleSelectTile"
    />

    <!-- Mobile Player Details Bottom Sheet Modal -->
    <PlayerDetailModal
      :tile-num="selectedTileNum"
      :players="selectedTilePlayers"
      @close="closeTileModal"
    />
  </div>
</template>

<script setup lang="ts">
interface Player {
  id: number
  player_id: string
  name: string
  avatar?: string
  total_score: number
  status: string
}

const { data: playersData } = await useFetch<Player[]>('/api/players')

const players = computed(() => playersData.value || [])
const selectedTileNum = ref<number | null>(null)
const selectedTilePlayers = ref<Player[]>([])

function handleSelectTile(payload: { tileNum: number; players: Player[] }) {
  selectedTileNum.value = payload.tileNum
  selectedTilePlayers.value = payload.players
}

function closeTileModal() {
  selectedTileNum.value = null
  selectedTilePlayers.value = []
}

useHead({
  title: 'All-Star S-Shape Board',
})
</script>
