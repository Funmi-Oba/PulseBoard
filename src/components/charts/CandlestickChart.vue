<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        Price Action
      </h3>
      <span class="text-xs text-text-muted">Simulated OHLC</span>
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
import { CandlestickChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, CandlestickChart, GridComponent, TooltipComponent, DataZoomComponent])

const props = defineProps<{ isDark?: boolean }>()

// Generate simulated OHLC data
function generateOHLC() {
  const data = []
  const now = Date.now()
  let price = 100

  for (let i = 29; i >= 0; i--) {
    const open = price
    const close = open + (Math.random() - 0.5) * 10
    const high = Math.max(open, close) + Math.random() * 5
    const low = Math.min(open, close) - Math.random() * 5
    price = close
    data.push([now - i * 5000, open, close, low, high])
  }
  return data
}

const ohlcData = generateOHLC()

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: props.isDark ? '#2b0826' : '#ffffff',
    borderColor: props.isDark ? '#570f4c' : '#e5ddb3',
    textStyle: { color: props.isDark ? '#f2eed9' : '#1d1f14', fontSize: 12 },
    formatter: (params: any[]) => {
      const p = params[0]
      if (!p) return ''
      const [, open, close, low, high] = p.value
      return `
        Open: <b>${open.toFixed(2)}</b><br/>
        Close: <b>${close.toFixed(2)}</b><br/>
        Low: <b>${low.toFixed(2)}</b><br/>
        High: <b>${high.toFixed(2)}</b>
      `
    },
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
    scale: true,
    axisLine: { show: false },
    axisLabel: { color: props.isDark ? '#bea941' : '#a9ae84', fontSize: 10 },
    splitLine: {
      lineStyle: { color: props.isDark ? '#570f4c' : '#e5ddb3', type: 'dashed' },
    },
  },
  series: [
    {
      type: 'candlestick',
      data: ohlcData,
      itemStyle: {
        color: '#767b51',
        color0: '#b9467c',
        borderColor: '#767b51',
        borderColor0: '#b9467c',
      },
    },
  ],
}))
</script>