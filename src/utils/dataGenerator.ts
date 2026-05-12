import type { MetricPoint, ActivityEvent, DashboardMetric } from '@/types'

const EVENT_MESSAGES = [
  { message: 'CPU spike detected on server-01', source: 'System Monitor', type: 'warning' },
  { message: 'New user session started', source: 'Auth Service', type: 'info' },
  { message: 'Database query timeout', source: 'DB Monitor', type: 'error' },
  { message: 'Deployment successful', source: 'CI/CD Pipeline', type: 'success' },
  { message: 'Memory usage normalized', source: 'System Monitor', type: 'info' },
  { message: 'Unusual login attempt blocked', source: 'Security', type: 'warning' },
  { message: 'API response time > 2s', source: 'API Gateway', type: 'warning' },
  { message: 'Backup completed successfully', source: 'Backup Service', type: 'success' },
  { message: 'Disk usage at 85%', source: 'Storage Monitor', type: 'error' },
  { message: 'New order received', source: 'Commerce Service', type: 'success' },
] as const

export function generateMetricPoint(previousValue: number, min: number, max: number): MetricPoint {
  const change = (Math.random() - 0.5) * (max - min) * 0.1
  const value = Math.min(max, Math.max(min, previousValue + change))
  return {
    timestamp: Date.now(),
    value: Math.round(value * 100) / 100,
  }
}

export function generateActivityEvent(): ActivityEvent {
  const template = EVENT_MESSAGES[Math.floor(Math.random() * EVENT_MESSAGES.length)]
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    type: template.type as ActivityEvent['type'],
    message: template.message,
    source: template.source,
  }
}

export function generateInitialMetrics(): DashboardMetric[] {
  return [
    { id: 'cpu', label: 'CPU Usage', value: 45, previousValue: 45, unit: '%', trend: 'stable' },
    { id: 'memory', label: 'Memory Usage', value: 62, previousValue: 62, unit: '%', trend: 'stable' },
    { id: 'requests', label: 'Requests/sec', value: 120, previousValue: 120, unit: 'req/s', trend: 'stable' },
    { id: 'errors', label: 'Error Rate', value: 0.5, previousValue: 0.5, unit: '%', trend: 'stable' },
  ]
}

export function generateInitialSeries(): import('@/types').MetricSeries[] {
  const now = Date.now()
  const points = (min: number, max: number) =>
    Array.from({ length: 30 }, (_, i) => ({
      timestamp: now - (29 - i) * 2000,
      value: Math.round((Math.random() * (max - min) + min) * 100) / 100,
    }))

  return [
    { id: 'cpu', name: 'CPU', color: '#6366f1', data: points(20, 80) },
    { id: 'memory', name: 'Memory', color: '#22d3ee', data: points(40, 90) },
    { id: 'requests', name: 'Requests', color: '#34d399', data: points(80, 200) },
    { id: 'errors', name: 'Errors', color: '#f87171', data: points(0, 5) },
  ]
}

export function updateMetric(metric: DashboardMetric): DashboardMetric {
  const ranges: Record<string, [number, number]> = {
    cpu: [5, 95],
    memory: [30, 95],
    requests: [50, 300],
    errors: [0, 5],
  }
  const [min, max] = ranges[metric.id] ?? [0, 100]
  const newPoint = generateMetricPoint(metric.value, min, max)
  const trend =
    newPoint.value > metric.value + 0.5
      ? 'up'
      : newPoint.value < metric.value - 0.5
        ? 'down'
        : 'stable'
  return {
    ...metric,
    previousValue: metric.value,
    value: newPoint.value,
    trend,
  }
}