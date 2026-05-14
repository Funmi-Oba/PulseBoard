<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        System Radar
      </h3>
      <span class="text-xs text-text-muted">Current Snapshot</span>
    </div>

    <!-- Chart -->
    <v-chart
      class="w-full"
      :style="{ height: '280px' }"
      :option="chartOption"
      :autoresize="true"
    />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { RadarComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { DashboardMetric } from '@/types'

use([CanvasRenderer, RadarChart, RadarComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  metrics: DashboardMetric[]
  isDark?: boolean
}>()

const chartOption = computed(() => {
  const indicators = props.metrics.map((m) => ({
    name: m.label,
    max: m.id === 'requests' ? 300 : 100,
  }))

  const values = props.metrics.map((m) =>
    m.id === 'requests' ? m.value : m.value
  )

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: props.isDark ? '#2b0826' : '#ffffff',
      borderColor: props.isDark ? '#570f4c' : '#e5ddb3',
      textStyle: { color: props.isDark ? '#f2eed9' : '#1d1f14', fontSize: 12 },
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: props.isDark ? '#d8cb8d' : '#767b51',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: props.isDark ? '#570f4c' : '#e5ddb3',
        },
      },
      splitArea: {
        areaStyle: {
          color: props.isDark
            ? ['rgba(45,49,72,0.3)', 'rgba(30,5,27,0.3)']
            : ['rgba(248,246,236,0.5)', 'rgba(229,221,179,0.3)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: props.isDark ? '#570f4c' : '#e5ddb3',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: 'Current',
            itemStyle: { color: '#ad1f98' },
            lineStyle: { color: '#ad1f98', width: 2 },
            areaStyle: { color: 'rgba(173,31,152,0.2)' },
          },
        ],
      },
    ],
  }
})
</script>