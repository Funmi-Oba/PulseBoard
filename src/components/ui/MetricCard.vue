<template>
  <div class="bg-bg-card border p-5 border-border rounded-xl  shadow-sm transition-all duration-300 hover:shadow-md cursor-default">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-xs font-semibold uppercase tracking-widest text-text-secondary">
        {{ metric.label }}
      </span>
      <span class="text-lg font-bold" :class="trendColor">
        {{ trendIcon }}
      </span>
    </div>

    <!-- Value -->
    <div class="flex items-baseline gap-1 mb-2">
      <span class="text-3xl font-bold leading-none text-text-primary">
        {{ formattedValue }}
      </span>
      <span class="text-base font-normal text-text-muted">
        {{ metric.unit }}
      </span>
    </div>

    <!-- Change -->
    <div class="text-xs text-text-muted">
      {{ changeText }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardMetric } from '@/types'

const props = defineProps<{ metric: DashboardMetric }>()

const formattedValue = computed(() =>
  props.metric.value % 1 === 0
    ? props.metric.value.toString()
    : props.metric.value.toFixed(1)
)

const trendIcon = computed(() =>
  props.metric.trend === 'up' ? '↑' : props.metric.trend === 'down' ? '↓' : '→'
)

const trendColor = computed(() =>
  props.metric.trend === 'up'
    ? 'text-danger'
    : props.metric.trend === 'down'
      ? 'text-success'
      : 'text-text-muted'
)

const changeText = computed(() => {
  const diff = props.metric.value - props.metric.previousValue
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff.toFixed(1)} from last update`
})
</script>