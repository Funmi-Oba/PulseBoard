<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
    >
      <!-- Spinner -->
      <div class="relative w-16 h-16 mb-6">
        <div
          class="absolute inset-0 rounded-full border-4 border-border"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"
        ></div>
      </div>

      <!-- Text -->
      <p class="text-accent font-bold text-lg tracking-widest uppercase">PulseBoard</p>
      <p class="text-text-muted text-sm mt-1">Initializing data stream...</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>