<template>
  <Transition name="banner">
    <div
      v-if="show"
      class="flex items-center justify-between gap-4 px-6 py-3 text-sm font-medium"
      :class="statusClass"
    >
      <div class="flex items-center gap-2">
        <span>{{ statusIcon }}</span>
        <span>{{ statusMessage }}</span>
      </div>
      <button
        v-if="status === 'disconnected'"
        class="px-3 py-1 rounded-lg border border-current text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
        @click="$emit('reconnect')"
      >
        Reconnect
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'connected' | 'disconnected' | 'reconnecting'
}>()

defineEmits<{ reconnect: [] }>()

const show = computed(() => props.status !== 'connected')

const statusClass = computed(() => ({
  disconnected: 'bg-danger/10 text-danger border-b border-danger/20',
  reconnecting: 'bg-warning/10 text-warning border-b border-warning/20',
  connected: '',
}[props.status]))

const statusIcon = computed(() => ({
  disconnected: '🔴',
  reconnecting: '🟡',
  connected: '🟢',
}[props.status]))

const statusMessage = computed(() => ({
  disconnected: 'Stream disconnected. Data is no longer updating.',
  reconnecting: 'Attempting to reconnect...',
  connected: '',
}[props.status]))
</script>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: all 0.3s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>