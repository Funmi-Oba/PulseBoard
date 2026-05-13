<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        {{ title }}
      </h3>
      <!-- Chart Type Switcher -->
      <div class="flex items-center gap-1">
        <button
          v-for="type in chartTypes"
          :key="type.value"
          class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer"
          :class="activeType === type.value
            ? 'bg-accent text-white border-accent'
            : 'border-border text-text-muted hover:border-accent hover:text-accent'"
          @click="activeType = type.value"
        >
          {{ type.label }}
        </button>
      </div>
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
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { MetricSeries } from '@/types'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  title: string
  series: MetricSeries[]
  isDark?: boolean
}>()

const activeType = ref<'line' | 'bar' | 'area'>('line')

const chartTypes = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' },
  { label: 'Area', value: 'area' },
] as const

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  animation: true,
  animationDuration: 300,
  tooltip: {
    trigger: 'axis',
    backgroundColor: props.isDark ? '#2b0826' : '#ffffff',
    borderColor: props.isDark ? '#570f4c' : '#e5ddb3',
    textStyle: { color: props.isDark ? '#f2eed9' : '#1d1f14', fontSize: 12 },
    formatter: (params: any[]) =>
      params
        .map((p) => `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${p.value[1]}</b>`)
        .join('<br/>'),
  },
  legend: {
    bottom: 0,
    textStyle: { color: props.isDark ? '#d8cb8d' : '#767b51', fontSize: 11 },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
  },
  grid: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 40,
    containLabel: true,
  },
  xAxis: {
    type: 'time',
    axisLine: { lineStyle: { color: props.isDark ? '#570f4c' : '#e5ddb3' } },
    axisLabel: {
      color: props.isDark ? '#bea941' : '#a9ae84',
      fontSize: 10,
      formatter: (val: number) => {
        const d = new Date(val)
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
      },
    },
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
  series: props.series.map((s) => ({
    name: s.name,
    type: activeType.value === 'bar' ? 'bar' : 'line',
    smooth: true,
    symbol: 'none',
    itemStyle: { color: s.color },
    lineStyle: { color: s.color, width: 2 },
    areaStyle: activeType.value === 'area' || activeType.value === 'line'
      ? {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: s.color + (activeType.value === 'area' ? '88' : '33') },
              { offset: 1, color: s.color + '00' },
            ],
          },
        }
      : undefined,
    data: s.data.map((p) => [p.timestamp, p.value]),
  })),
}))
</script>