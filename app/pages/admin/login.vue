<template>
  <div class="min-h-screen bg-surface-900 flex items-center justify-center p-4">
    <AdminLoginModal
      :show="true"
      @close="navigateTo('/')"
      @success="navigateTo('/admin')"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>


