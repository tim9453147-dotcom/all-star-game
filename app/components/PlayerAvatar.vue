<template>
  <div
    class="relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 group"
    :class="[
      sizeClasses[size] || 'w-10 h-10',
      shapeClass,
      border ? 'border-2' : '',
      ring ? 'ring-2 ring-offset-2 ring-offset-surface-900' : '',
    ]"
    :style="{
      borderColor: border ? meta.color : undefined,
      '--tw-ring-color': ring ? meta.color : undefined,
    }"
  >
    <!-- Background Gradient Container -->
    <div
      class="w-full h-full overflow-hidden flex items-center justify-center bg-surface-900/90 relative"
      :class="shapeClass"
    >
      <!-- Subtly shaded backdrop -->
      <div
        class="absolute inset-0 opacity-20 bg-gradient-to-br"
        :class="meta.bgGradient"
      />

      <!-- Main Image Avatar -->
      <img
        v-if="!hasError && imageSrc"
        :src="imageSrc"
        :alt="meta.name"
        class="w-full h-full object-contain p-0.5 relative z-10 transition-transform duration-300 group-hover:scale-105"
        @error="onImageError"
      />

      <!-- Fallback SVG/Initial Letter if Image Fails or is Missing -->
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center relative z-10 font-bold select-none p-0.5"
        :style="{ backgroundColor: meta.color + '22', color: meta.color }"
      >
        <span
          :class="size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'"
          class="leading-none drop-shadow"
        >
          {{ meta.emoji || '👤' }}
        </span>
        <span
          v-if="name && size !== 'xs'"
          class="text-[10px] text-white font-mono mt-0.5 truncate max-w-[80%]"
        >
          {{ initialLetter }}
        </span>
      </div>
    </div>

    <!-- Optional Indicator Badge (e.g. status dot or role emoji) -->
    <div
      v-if="showBadge"
      class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md border border-surface-900 z-20"
      :style="{ backgroundColor: meta.color }"
    >
      {{ meta.emoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getAvatarUrl, getCharacterMeta } from '~/utils/avatar'

const props = withDefaults(
  defineProps<{
    avatar?: string
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    shape?: 'circle' | 'square' | 'rounded'
    border?: boolean
    ring?: boolean
    showBadge?: boolean
  }>(),
  {
    avatar: 'char-1',
    name: '',
    size: 'md',
    shape: 'square',
    border: true,
    ring: false,
    showBadge: false,
  }
)

const hasError = ref(false)

const imageSrc = computed(() => {
  return getAvatarUrl(props.avatar)
})

const meta = computed(() => {
  return getCharacterMeta(props.avatar)
})

const initialLetter = computed(() => {
  if (!props.name) return ''
  return props.name.trim().charAt(0).toUpperCase()
})

const shapeClass = computed(() => {
  if (props.shape === 'circle') return 'rounded-full'
  if (props.shape === 'rounded') return 'rounded-xl'
  return 'rounded-2xl'
})

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-18 h-18 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
}

function onImageError() {
  hasError.value = true
}

// Reset error state if avatar prop changes
watch(
  () => props.avatar,
  () => {
    hasError.value = false
  }
)
</script>
