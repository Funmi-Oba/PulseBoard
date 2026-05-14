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
const MAX_RECONNECT_ATTEMPTS = 5
const BASE_RECONNECT_DELAY = 1000

export const useDashboardStore = defineStore('dashboard', () => {
  // --- State ---
  const isStreaming = ref(true)
  const timeRange = ref<TimeRange>('live')
  const metrics = ref<DashboardMetric[]>(generateInitialMetrics())
  const series = ref<MetricSeries[]>(generateInitialSeries())
  const activityFeed = ref<ActivityEvent[]>([])
  const connectionStatus = ref<'connected' | 'disconnected' | 'reconnecting'>('connected')
  const hiddenSeries = ref<string[]>([])
  const reconnectAttempts = ref(0)

  let streamInterval: ReturnType<typeof setInterval> | null = null
  let activityInterval: ReturnType<typeof setInterval> | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

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
    return series.value
      .filter((s) => !hiddenSeries.value.includes(s.id))
      .map((s) => ({
        ...s,
        data: s.data.filter((p) => p.timestamp >= cutoff),
      }))
  })

  // --- Helpers ---
  function validateAndSanitizeEvent(event: unknown): ActivityEvent | null {
    if (!event || typeof event !== 'object') return null
    const e = event as Record<string, unknown>
    const validTypes = ['info', 'warning', 'error', 'success']
    if (
      typeof e.id !== 'string' ||
      typeof e.timestamp !== 'number' ||
      typeof e.message !== 'string' ||
      typeof e.source !== 'string' ||
      !validTypes.includes(e.type as string)
    ) return null

    return {
      id: e.id.slice(0, 100),
      timestamp: e.timestamp,
      type: e.type as ActivityEvent['type'],
      message: e.message.slice(0, 200).replace(/[<>]/g, ''),
      source: e.source.slice(0, 100).replace(/[<>]/g, ''),
    }
  }

  function validateMetricPoint(value: unknown, min: number, max: number): number {
    const num = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(num)) return (min + max) / 2
    return Math.min(max, Math.max(min, num))
  }

  // --- Actions ---
  function startStreaming() {
    if (streamInterval) return

    streamInterval = setInterval(() => {
      try {
        metrics.value = metrics.value.map(updateMetric)
        series.value = series.value.map((s) => {
          const last = s.data[s.data.length - 1]
          const ranges: Record<string, [number, number]> = {
            cpu: [5, 95],
            memory: [30, 95],
            requests: [50, 300],
            errors: [0, 5],
          }
          const [min, max] = ranges[s.id] ?? [0, 100]
          const rawPoint = generateMetricPoint(last?.value ?? 50, min, max)
          const validatedPoint = {
            timestamp: Date.now(),
            value: validateMetricPoint(rawPoint.value, min, max),
          }
          const newData = [...s.data, validatedPoint]
          return {
            ...s,
            data: newData.length > MAX_DATA_POINTS ? newData.slice(-MAX_DATA_POINTS) : newData,
          }
        })
      } catch (err) {
        console.warn('Stream update error:', err)
      }
    }, 2000)

    activityInterval = setInterval(() => {
      try {
        const raw = generateActivityEvent()
        const validated = validateAndSanitizeEvent(raw)
        if (validated) {
          activityFeed.value = [validated, ...activityFeed.value].slice(0, MAX_FEED_ITEMS)
        }
      } catch (err) {
        console.warn('Activity feed error:', err)
      }
    }, 3000)

    connectionStatus.value = 'connected'
    isStreaming.value = true
    reconnectAttempts.value = 0
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
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    isStreaming.value = false
    connectionStatus.value = 'connected'
  }

  function simulateDisconnect() {
    if (streamInterval) {
      clearInterval(streamInterval)
      streamInterval = null
    }
    if (activityInterval) {
      clearInterval(activityInterval)
      activityInterval = null
    }
    isStreaming.value = false
    connectionStatus.value = 'disconnected'
    attemptReconnect()
  }

  function attemptReconnect() {
    if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
      connectionStatus.value = 'disconnected'
      return
    }

    const delay = BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.value)
    connectionStatus.value = 'reconnecting'
    reconnectAttempts.value++

    reconnectTimeout = setTimeout(() => {
      startStreaming()
    }, delay)
  }

  function manualReconnect() {
    reconnectAttempts.value = 0
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    startStreaming()
  }

  function toggleStreaming() {
    isStreaming.value ? stopStreaming() : startStreaming()
  }

  function setTimeRange(range: TimeRange) {
    timeRange.value = range
  }

  function toggleSeries(id: string) {
    if (hiddenSeries.value.includes(id)) {
      hiddenSeries.value = hiddenSeries.value.filter((s) => s !== id)
    } else {
      hiddenSeries.value = [...hiddenSeries.value, id]
    }
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
    hiddenSeries,
    reconnectAttempts,
    filteredSeries,
    startStreaming,
    stopStreaming,
    toggleStreaming,
    simulateDisconnect,
    manualReconnect,
    setTimeRange,
    toggleSeries,
    cleanup,
  }
})