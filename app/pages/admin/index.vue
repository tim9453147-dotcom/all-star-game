<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
await navigateTo('/admin/players', { replace: true })
</script>

<template>
  <div class="flex items-center justify-center min-h-[50vh] text-surface-400 text-sm font-medium">
    載入玩家管理...
  </div>
</template>
