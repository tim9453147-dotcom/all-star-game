<template>
  <div class="py-3 sm:py-6 px-2 sm:px-4 max-w-5xl mx-auto flex flex-col items-center">
    <!-- Pure S-shaped Serpentine Board -->
    <WindingBoard
      :players="players"
      @select-player="selectPlayer"
    />

    <!-- Mobile Player Details Bottom Sheet Modal -->
    <PlayerDetailModal
      :player="selectedPlayer"
      :is-leader="selectedPlayer?.id === topPlayer?.id"
      @close="selectedPlayer = null"
    />
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

const topPlayer = computed(() => {
  if (!players.value || players.value.length === 0) return null
  return [...players.value].sort((a, b) => b.total_score - a.total_score)[0]
})

function selectPlayer(p: Player) {
  selectedPlayer.value = p
}

useHead({
  title: 'All-Star S-Shape Board',
})
</script>
