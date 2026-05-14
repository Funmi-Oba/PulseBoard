<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 bg-bg-card border border-border rounded-xl p-4 shadow-lg w-64"
    >
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Keyboard Shortcuts
        </h3>
        <button
          class="text-text-muted hover:text-text-primary cursor-pointer text-sm"
          @click="$emit('close')"
        >✕</button>
      </div>
      <div class="flex flex-col gap-2">
        <div v-for="shortcut in shortcuts" :key="shortcut.key" class="flex justify-between items-center">
          <span class="text-xs text-text-secondary">{{ shortcut.label }}</span>
          <kbd class="px-2 py-0.5 rounded bg-bg-primary border border-border text-xs font-mono text-text-primary">
            {{ shortcut.key }}
          </kbd>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Toggle Button -->
  <button
    class="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
    :class="show ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    @click="$emit('open')"
    title="Keyboard Shortcuts"
  >
    ⌨️
  </button>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{ close: [], open: [] }>()

const shortcuts = [
  { key: 'Space', label: 'Pause / Resume' },
  { key: '1', label: 'Last 1 Min' },
  { key: '2', label: 'Last 5 Mins' },
  { key: '3', label: 'Last 1 Hour' },
  { key: '4', label: 'Live Mode' },
  { key: 'D', label: 'Toggle Dark Mode' },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>