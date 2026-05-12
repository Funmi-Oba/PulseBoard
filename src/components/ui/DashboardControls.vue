<template>
  <div class="bg-bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 transition-all duration-300">

    <!-- Left: Pause/Resume -->
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 cursor-pointer"
      :class="isStreaming
        ? 'bg-danger/10 border-danger text-danger hover:bg-danger/20'
        : 'bg-success/10 border-success text-success hover:bg-success/20'"
      @click="$emit('toggleStreaming')"
    >
      <span>{{ isStreaming ? '⏸' : '▶️' }}</span>
      {{ isStreaming ? 'Pause Stream' : 'Resume Stream' }}
    </button>

    <!-- Right: Time Range Filters -->
    <div class="flex items-center gap-2">
      <span class="text-xs text-text-muted font-medium uppercase tracking-widest mr-1">Range:</span>
      <button
        v-for="range in timeRanges"
        :key="range.value"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 cursor-pointer"
        :class="currentRange === range.value
          ? 'bg-accent text-white border-accent'
          : 'bg-bg-card border-border text-text-secondary hover:border-accent hover:text-accent'"
        @click="$emit('setRange', range.value)"
      >
        {{ range.label }}
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { TimeRange } from '@/types'

defineProps<{
  isStreaming: boolean
  currentRange: TimeRange
}>()

defineEmits<{
  toggleStreaming: []
  setRange: [range: TimeRange]
}>()

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '1 Min', value: '1m' },
  { label: '5 Min', value: '5m' },
  { label: '1 Hour', value: '1h' },
  { label: 'Live', value: 'live' },
]
</script>