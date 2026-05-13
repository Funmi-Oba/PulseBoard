<template>
  <div class="bg-bg-card border border-border rounded-xl p-4 transition-all duration-300">
    <h3 class="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
      Toggle Datasets
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="s in allSeries"
        :key="s.id"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer"
        :class="hiddenSeries.includes(s.id)
          ? 'border-border text-text-muted bg-bg-primary opacity-50'
          : 'border-border text-text-primary bg-bg-card'"
        @click="$emit('toggle', s.id)"
      >
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: hiddenSeries.includes(s.id) ? '#a9ae84' : s.color }"
        ></span>
        {{ s.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetricSeries } from '@/types'

defineProps<{
  allSeries: MetricSeries[]
  hiddenSeries: string[]
}>()

defineEmits<{ toggle: [id: string] }>()
</script>