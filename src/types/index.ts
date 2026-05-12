export interface MetricPoint {
  timestamp: number
  value: number
}

export interface MetricSeries {
  id: string
  name: string
  color: string
  data: MetricPoint[]
}

export interface ActivityEvent {
  id: string
  timestamp: number
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  source: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: number
  previousValue: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

export type TimeRange = '1m' | '5m' | '1h' | 'live'

export interface DashboardState {
  isStreaming: boolean
  timeRange: TimeRange
  metrics: DashboardMetric[]
  series: MetricSeries[]
  activityFeed: ActivityEvent[]
}