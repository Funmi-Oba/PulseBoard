<template>
  <div class="fixed top-20 right-6 z-50 flex flex-col gap-2 w-80">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 p-4 rounded-xl border shadow-lg cursor-pointer transition-all duration-200 hover:opacity-90"
        :class="toastClass(toast.type)"
        @click="remove(toast.id)"
      >
        <span class="text-lg shrink-0">{{ toastIcon(toast.type) }}</span>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-xs font-bold uppercase tracking-widest">{{ toast.type }}</span>
          <span class="text-xs font-medium text-text-primary truncate">{{ toast.message }}</span>
          <span class="text-xs text-text-primary">{{ toast.source }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ActivityEvent } from '@/types'

const props = defineProps<{ feed: ActivityEvent[] }>()

interface Toast extends ActivityEvent {
  timeoutId?: ReturnType<typeof setTimeout>
}

const toasts = ref<Toast[]>([])
const MAX_TOASTS = 4

// Only show toasts for warning and error events
watch(
  () => props.feed[0],
  (newEvent) => {
    if (!newEvent) return
    if (!['warning', 'error'].includes(newEvent.type)) return

    const toast: Toast = { ...newEvent }
    toasts.value = [toast, ...toasts.value].slice(0, MAX_TOASTS)

    toast.timeoutId = setTimeout(() => {
      remove(toast.id)
    }, 4000)
  }
)

function remove(id: string) {
  const toast = toasts.value.find((t) => t.id === id)
  if (toast?.timeoutId) clearTimeout(toast.timeoutId)
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function toastClass(type: ActivityEvent['type']): string {
  return {
    info:    'bg-bg-card border-info/30',
    success: 'bg-bg-card border-success/30',
    warning: 'bg-warning/70 border-warning/80',
    error:   'bg-danger/70 border-danger/80',
  }[type]
}

function toastIcon(type: ActivityEvent['type']): string {
  return {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❗',
  }[type]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>