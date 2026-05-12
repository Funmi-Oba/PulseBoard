import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardMetric, MetricSeries, ActivityEvent, TimeRange } from '@/types'
import {
  generateInitialMetrics,
  generateInitialSeries,
  generateActivityEvent,
  updateMetric,
  generateMetricPoint,
} from '@/utils/dataGenerator'

const MAX_DATA_POINTS = 100
const MAX_FEED_ITEMS = 50

export const useDashboardStore = defineStore('dashboard', () => {
  // --- State ---
  const isStreaming = ref(true)
  const timeRange = ref<TimeRange>('live')
  const metrics = ref<DashboardMetric[]>(generateInitialMetrics())
  const series = ref<MetricSeries[]>(generateInitialSeries())
  const activityFeed = ref<ActivityEvent[]>([])
  const connectionStatus = ref<'connected' | 'disconnected' | 'reconnecting'>('connected')

  let streamInterval: ReturnType<typeof setInterval> | null = null
  let activityInterval: ReturnType<typeof setInterval> | null = null

  // --- Computed ---
  const filteredSeries = computed(() => {
    const now = Date.now()
    const cutoffs: Record<TimeRange, number> = {
      '1m': now - 60_000,
      '5m': now - 300_000,
      '1h': now - 3_600_000,
      live: 0,
    }
    const cutoff = cutoffs[timeRange.value]
    return series.value.map((s) => ({
      ...s,
      data: s.data.filter((p) => p.timestamp >= cutoff),
    }))
  })

  // --- Actions ---
  function startStreaming() {
    if (streamInterval) return

    streamInterval = setInterval(() => {
      // Update metric cards
      metrics.value = metrics.value.map(updateMetric)

      // Update chart series
      series.value = series.value.map((s) => {
        const last = s.data[s.data.length - 1]
        const ranges: Record<string, [number, number]> = {
          cpu: [5, 95],
          memory: [30, 95],
          requests: [50, 300],
          errors: [0, 5],
        }
        const [min, max] = ranges[s.id] ?? [0, 100]
        const newPoint = generateMetricPoint(last?.value ?? 50, min, max)
        const newData = [...s.data, newPoint]
        return {
          ...s,
          data: newData.length > MAX_DATA_POINTS ? newData.slice(-MAX_DATA_POINTS) : newData,
        }
      })
    }, 2000)

    activityInterval = setInterval(() => {
      const event = generateActivityEvent()
      activityFeed.value = [event, ...activityFeed.value].slice(0, MAX_FEED_ITEMS)
    }, 3000)
 
    connectionStatus.value = 'connected'
    isStreaming.value = true
  }

  function stopStreaming() {
    if (streamInterval) {
      clearInterval(streamInterval)
      streamInterval = null
    }
    if (activityInterval) {
      clearInterval(activityInterval)
      activityInterval = null
    }
    isStreaming.value = false
    connectionStatus.value = 'connected' // keep connected, paused is intentional
  }

  function toggleStreaming() {
    isStreaming.value ? stopStreaming() : startStreaming()
  }

  function setTimeRange(range: TimeRange) {
    timeRange.value = range
  }

  function cleanup() {
    stopStreaming()
  }

  // Auto-start
  startStreaming()

  return {
    isStreaming,
    timeRange,
    metrics,
    series,
    activityFeed,
    connectionStatus,
    filteredSeries,
    startStreaming,
    stopStreaming,
    toggleStreaming,
    setTimeRange,
    cleanup,
  }
})
