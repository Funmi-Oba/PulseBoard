<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        {{ title }}
      </h3>
      <span class="text-xs text-text-muted">Latest Values</span>
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
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { MetricSeries } from '@/types'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  title: string
  series: MetricSeries[]
  isDark?: boolean
}>()

const chartOption = computed(() => {
  const categories = props.series.map((s) => s.name)
  const values = props.series.map((s) => {
    const last = s.data[s.data.length - 1]
    return last ? Math.round(last.value * 100) / 100 : 0
  })
  const colors = props.series.map((s) => s.color)

  return {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 300,
    tooltip: {
      trigger: 'axis',
      backgroundColor: props.isDark ? '#2b0826' : '#ffffff',
      borderColor: props.isDark ? '#570f4c' : '#e5ddb3',
      textStyle: { color: props.isDark ? '#f2eed9' : '#1d1f14', fontSize: 12 },
    },
    grid: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: props.isDark ? '#570f4c' : '#e5ddb3' } },
      axisLabel: { color: props.isDark ? '#bea941' : '#a9ae84', fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: props.isDark ? '#bea941' : '#a9ae84', fontSize: 10 },
      splitLine: {
        lineStyle: { color: props.isDark ? '#570f4c' : '#e5ddb3', type: 'dashed' },
      },
    },
    series: [
      {
        type: 'bar',
        data: values.map((val, i) => ({
          value: val,
          itemStyle: {
            color: colors[i],
            borderRadius: [6, 6, 0, 0],
          },
        })),
        barMaxWidth: 60,
      },
    ],
  }
})
</script>