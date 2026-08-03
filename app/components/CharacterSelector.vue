<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <label class="block text-xs sm:text-sm font-bold text-surface-200 flex items-center gap-1.5">
        <span>🎨 選擇你的像素遊戲角色</span>
      </label>
      <span class="text-[11px] font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <span>✨</span>
        <span>像素 4 大職業 × 4 階進階</span>
      </span>
    </div>

    <!-- Active Selection Preview Card -->
    <div
      class="bg-gradient-to-br from-surface-900 via-surface-900/95 to-surface-800 border border-white/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl relative overflow-hidden"
    >
      <!-- Background Ambient Glow -->
      <div
        class="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-25 pointer-events-none"
        :style="{ backgroundColor: currentMeta.color }"
      />

      <div class="flex items-center gap-3.5 w-full sm:w-auto">
        <PlayerAvatar
          :avatar="modelValue"
          size="lg"
          shape="square"
          border
          ring
          showBadge
          class="shrink-0 shadow-lg"
        />

        <div class="flex-1 min-w-0 sm:hidden">
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-white truncate">
              {{ currentMeta.emoji }} {{ currentMeta.name }}
            </span>
            <span
              v-if="currentMeta.tierName"
              class="text-[9px] px-2 py-0.5 rounded-full font-bold bg-primary-500/20 border border-primary-400/40 text-primary-300 shrink-0"
            >
              Stage {{ currentMeta.tier || 1 }}・{{ currentMeta.tierName }}
            </span>
          </div>
          <p class="text-xs text-primary-300 font-medium truncate mt-0.5">
            {{ currentMeta.title }}
          </p>
        </div>
      </div>

      <div class="flex-1 min-w-0 w-full">
        <div class="hidden sm:flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-base font-black text-white tracking-wide flex items-center gap-1.5">
              <span>{{ currentMeta.emoji }}</span>
              <span>{{ currentMeta.name }}</span>
            </span>
            <span
              class="text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider text-white"
              :style="{ backgroundColor: currentMeta.color + '44', border: `1px solid ${currentMeta.color}88` }"
            >
              {{ currentMeta.title }}
            </span>
            <span
              v-if="currentMeta.tierName"
              class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300"
            >
              階級 {{ currentMeta.tier }} / 4 ({{ currentMeta.tierName }})
            </span>
          </div>
          <span class="text-xs px-2.5 py-0.5 bg-surface-800 border border-white/10 text-surface-300 rounded-lg font-mono">
            ID: {{ modelValue }}
          </span>
        </div>

        <p class="text-xs text-surface-300 mt-1.5 leading-relaxed">
          {{ currentMeta.description }}
        </p>

        <!-- Novice Career Path Indicator -->
        <div v-if="currentMeta.classId" class="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-surface-300">
          <span class="font-bold text-surface-200 shrink-0">職業進化路線：</span>
          <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span
              v-for="st in getClassStages(currentMeta.classId)"
              :key="st.id"
              class="px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap transition cursor-pointer"
              :class="[
                modelValue === st.id
                  ? 'bg-primary-500 text-white font-bold ring-1 ring-white/40'
                  : 'bg-surface-800 text-surface-400 hover:text-white'
              ]"
              @click="selectChar(st.id)"
            >
              {{ st.tier }}. {{ st.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Novice Quick Selection Cards (Initial 4 Classes) -->
    <div class="bg-surface-900/60 border border-white/10 rounded-2xl p-3 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-black text-amber-300 flex items-center gap-1.5">
          <span>🌱 新手加入可選：四大初學者職業</span>
        </span>
        <span class="text-[10px] text-surface-400">點擊角色即可直接選取</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="novice in NOVICE_CHARACTERS"
          :key="novice.id"
          type="button"
          class="p-2 rounded-xl border flex flex-col items-center text-center transition-all duration-200 relative group"
          :class="[
            modelValue === novice.id
              ? 'bg-gradient-to-b from-primary-600/40 via-surface-800 to-primary-900/40 border-primary-400 ring-2 ring-primary-400/60 shadow-lg scale-[1.02]'
              : 'bg-surface-800/80 border-white/10 hover:bg-surface-700/90 hover:border-white/30'
          ]"
          @click="selectChar(novice.id)"
        >
          <PlayerAvatar
            :avatar="novice.id"
            size="md"
            shape="square"
            :border="false"
            class="mb-1 pointer-events-none"
          />
          <span class="text-xs font-black text-white flex items-center gap-1">
            <span>{{ novice.emoji }}</span>
            <span>{{ novice.name }}</span>
          </span>
          <span class="text-[10px] text-primary-300 font-semibold mt-0.5">
            {{ novice.className }} (初學者)
          </span>

          <span
            v-if="modelValue === novice.id"
            class="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow"
          >
            ✓
          </span>
        </button>
      </div>
    </div>

    <!-- Controls: Category Segmented Tabs & Search -->
    <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
      <!-- Category Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          v-for="cat in CHARACTER_CATEGORIES"
          :key="cat.id"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0"
          :class="[
            selectedCategory === cat.id
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 ring-1 ring-primary-400/50'
              : 'bg-surface-800/70 text-surface-400 hover:bg-surface-700 hover:text-white border border-white/5'
          ]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Quick Filter Search Input -->
      <div class="relative min-w-[140px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋角色..."
          class="w-full pl-8 pr-6 py-1.5 bg-surface-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition"
        />
        <span class="absolute left-2.5 top-1.5 text-surface-400 text-xs">🔍</span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-1.5 text-surface-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Character Grid (Filtered List) -->
    <div class="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar p-1">
      <button
        v-for="char in filteredCharacters"
        :key="char.id"
        type="button"
        class="relative aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-between border transition-all duration-200 group focus:outline-none"
        :class="[
          modelValue === char.id
            ? 'bg-gradient-to-br from-primary-600/40 via-surface-800 to-accent-600/30 border-primary-400 ring-2 ring-primary-400/60 shadow-lg shadow-primary-500/25 scale-[1.04] z-10'
            : 'bg-surface-800/60 border-white/10 hover:bg-surface-700/80 hover:border-white/30 hover:scale-[1.02]'
        ]"
        @click="selectChar(char.id)"
      >
        <!-- Top Row: Emoji & Tier -->
        <div class="w-full flex items-center justify-between text-[10px] px-0.5">
          <span class="opacity-90 group-hover:scale-110 transition-transform">{{ char.emoji }}</span>
          <span
            class="font-mono font-bold px-1 rounded text-[9px]"
            :class="char.tier ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-surface-900/80 text-surface-400'"
          >
            {{ char.tier ? `T${char.tier}` : `#${char.num}` }}
          </span>
        </div>

        <!-- Avatar Center Image -->
        <PlayerAvatar
          :avatar="char.id"
          size="sm"
          shape="square"
          :border="false"
          class="pointer-events-none my-0.5"
        />

        <!-- Character Name Label -->
        <span
          class="text-[10px] font-bold text-center truncate w-full px-0.5"
          :class="modelValue === char.id ? 'text-primary-300 font-extrabold' : 'text-surface-300 group-hover:text-white'"
        >
          {{ char.name }}
        </span>

        <!-- Selected Badge Corner -->
        <div
          v-if="modelValue === char.id"
          class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-md ring-1 ring-white/50"
        >
          ✓
        </div>
      </button>

      <!-- Empty Filter State -->
      <div
        v-if="filteredCharacters.length === 0"
        class="col-span-full py-8 text-center bg-surface-900/40 rounded-2xl border border-white/5 text-surface-400 text-xs"
      >
        <span class="text-xl block mb-1">🔍</span>
        <span>沒有找到符合條件的角色</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CHARACTERS,
  NOVICE_CHARACTERS,
  PIXEL_RPG_CHARACTERS,
  CHARACTER_CATEGORIES,
  getCharacterMeta,
} from '~/utils/avatar'
import PlayerAvatar from './PlayerAvatar.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: 'archer-1',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedCategory = ref<string>('novice')
const searchQuery = ref<string>('')

const currentMeta = computed(() => {
  return getCharacterMeta(props.modelValue)
})

const filteredCharacters = computed(() => {
  return CHARACTERS.filter((char) => {
    // Category match
    let matchCategory = selectedCategory.value === 'all' || char.category === selectedCategory.value
    if (selectedCategory.value === 'novice') {
      matchCategory = char.isNovice === true || char.category === 'novice'
    } else if (selectedCategory.value === 'pixel_rpg') {
      matchCategory = !!char.classId || char.category === 'pixel_rpg'
    } else if (['archer', 'mage', 'swordsman', 'warrior'].includes(selectedCategory.value)) {
      matchCategory = char.classId === selectedCategory.value
    }

    // Search query match
    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      !query ||
      char.name.toLowerCase().includes(query) ||
      char.title.toLowerCase().includes(query) ||
      char.id.toLowerCase().includes(query) ||
      (char.className && char.className.toLowerCase().includes(query)) ||
      String(char.num).includes(query)

    return matchCategory && matchSearch
  })
})

function getClassStages(classId?: string) {
  if (!classId) return []
  return PIXEL_RPG_CHARACTERS.filter((c) => c.classId === classId).sort((a, b) => (a.tier || 0) - (b.tier || 0))
}

function selectChar(id: string) {
  emit('update:modelValue', id)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

