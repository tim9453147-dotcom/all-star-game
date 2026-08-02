# Minimal Map Node Player IDs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the map node click behavior so that clicking any node displays a minimal modal showing only the list of player IDs (`player_id`) on that node, omitting all other statistics.

**Architecture:** Update `PlayerDetailModal.vue` to accept `tileNum` and `players` array, displaying only player IDs. Update `WindingBoard.vue` to emit the selected tile's number and player list, and update `app/pages/index.vue` to bind the new tile state to the modal.

**Tech Stack:** Vue 3 / Nuxt 3, TypeScript, Tailwind CSS.

## Global Constraints

- Keep visual design minimal, elegant, and fast-loading.
- Display ONLY `player_id` strings for players on the clicked tile.
- Preserve existing backdrop and click-to-close behavior.

---

### Task 1: Update `PlayerDetailModal.vue` to show only Player IDs for a tile

**Files:**
- Modify: `app/components/PlayerDetailModal.vue`

**Interfaces:**
- Consumes: `Player` interface `{ id: number; player_id: string; name: string; total_score: number; status: string }`
- Produces: `<PlayerDetailModal :tile-num="selectedTileNum" :players="selectedTilePlayers" @close="..." />`

- [ ] **Step 1: Update `PlayerDetailModal.vue` props and template**

Replace content of `app/components/PlayerDetailModal.vue`:

```vue
<template>
  <Teleport to="body">
    <div v-if="tileNum !== null" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" @click="$emit('close')" />

      <!-- Sheet Modal Content -->
      <div class="relative w-full max-w-sm bg-surface-800/95 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 animate-slide-up backdrop-blur-2xl text-center">
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-surface-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          @click="$emit('close')"
        >
          ✕
        </button>

        <!-- Header -->
        <div class="mb-4">
          <span class="text-xs font-bold text-accent-400 uppercase tracking-wider">MAP NODE</span>
          <h3 class="text-2xl font-black text-white mt-0.5">格子 #{{ tileNum }}</h3>
        </div>

        <!-- Player List -->
        <div class="my-4 max-h-60 overflow-y-auto space-y-2 py-1">
          <template v-if="players && players.length > 0">
            <div
              v-for="p in players"
              :key="p.id"
              class="px-4 py-2.5 bg-surface-700/60 border border-white/10 rounded-xl text-white font-mono font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              {{ p.player_id }}
            </div>
          </template>
          <template v-else>
            <div class="py-4 text-surface-400 text-sm font-medium">
              此格子目前無玩家
            </div>
          </template>
        </div>

        <!-- Action Button -->
        <button
          class="w-full mt-2 py-3 bg-surface-700 hover:bg-surface-600 rounded-xl font-bold text-sm text-white transition active:scale-95 border border-white/10 shadow-lg"
          @click="$emit('close')"
        >
          關閉
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Player {
  id: number
  player_id: string
  name: string
  total_score: number
  status: string
}

defineProps<{
  tileNum: number | null
  players: Player[]
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
```

- [ ] **Step 2: Commit Task 1**

```bash
git add app/components/PlayerDetailModal.vue
git commit -m "refactor: simplify PlayerDetailModal to show tile player IDs only"
```

---

### Task 2: Update `WindingBoard.vue` and `app/pages/index.vue` to emit tile selection

**Files:**
- Modify: `app/components/WindingBoard.vue`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Update `WindingBoard.vue` tile click event**

In `app/components/WindingBoard.vue`:
Update emits declaration:
```ts
const emit = defineEmits<{
  (e: 'select-tile', payload: { tileNum: number; players: Player[] }): void
}>()
```
And update `handleTileClick`:
```ts
function handleTileClick(num: number) {
  highlightedTile.value = num
  const playersOnCell = cellPlayers(num)
  emit('select-tile', { tileNum: num, players: playersOnCell })
}
```
And update avatar badge `@click.stop`:
```vue
@click.stop="handleTileClick(cell.num)"
```

- [ ] **Step 2: Update `app/pages/index.vue`**

In `app/pages/index.vue`:
```vue
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
```

- [ ] **Step 3: Commit Task 2**

```bash
git add app/components/WindingBoard.vue app/pages/index.vue
git commit -m "feat: connect tile click event to display minimal player IDs modal"
```

---

### Task 3: Verify build and type checking

- [ ] **Step 1: Run type checking or build command**

Run: `npx nuxi typecheck` or `bun run build`
Expected: Success with 0 errors.

- [ ] **Step 2: Final commit if needed**

Commit any remaining fixes or verification artifacts.
