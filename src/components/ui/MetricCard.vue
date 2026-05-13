<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md cursor-default">

    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-xs font-semibold uppercase tracking-widest text-text-secondary">
        {{ metric.label }}
      </span>
      <span class="text-lg font-bold" :class="trendColor">
        {{ trendIcon }}
      </span>
    </div>

    <!-- Animated Value -->
    <div class="flex items-baseline gap-1 mb-2">
      <span class="text-3xl font-bold leading-none text-text-primary transition-all duration-300">
        {{ displayValue }}
      </span>
      <span class="text-base font-normal text-text-muted">
        {{ metric.unit }}
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full h-1.5 rounded-full bg-border mb-2 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :style="{ width: `${Math.min(metric.value, 100)}%`, backgroundColor: barColor }"
      ></div>
    </div>

    <!-- Change -->
    <div class="text-xs text-text-muted">
      {{ changeText }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { DashboardMetric } from '@/types'

const props = defineProps<{ metric: DashboardMetric }>()

const displayValue = ref(props.metric.value)

// Animate counter on value change
watch(
  () => props.metric.value,
  (newVal, oldVal) => {
    const steps = 20
    const diff = newVal - oldVal
    const stepValue = diff / steps
    let current = oldVal
    let step = 0

    const interval = setInterval(() => {
      step++
      current += stepValue
      displayValue.value = parseFloat(current.toFixed(1))
      if (step >= steps) {
        clearInterval(interval)
        displayValue.value = parseFloat(newVal.toFixed(1))
      }
    }, 30)
  }
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

const barColor = computed(() => {
  const colors: Record<string, string> = {
    cpu: '#ad1f98',
    memory: '#e052cb',
    requests: '#767b51',
    errors: '#b9467c',
  }
  return colors[props.metric.id] ?? '#ad1f98'
})

const changeText = computed(() => {
  const diff = props.metric.value - props.metric.previousValue
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff.toFixed(1)} from last update`
})
</script>