<template>
  <div class="min-h-screen bg-bg-primary text-text-primary transition-all duration-300">
    <!-- Loading Screen -->
    <LoadingScreen :show="isLoading" />
    <!-- Top Navbar -->
    <header
      class="bg-bg-card border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 z-50"
    >
      <div class="flex items-center gap-2">
        <span class="text-4xl">📊</span>
        <span class="font-bold text-lg text-accent">PulseBoard</span>
      </div>

      <div class="flex items-center gap-4">
        <!-- Connection Status -->
        <div
          class="flex items-center gap-2 uppercase text-sm text-danger font-medium"
          :class="store.isStreaming ? 'text-green-700' : 'text-danger'"
        >
          <span
            class="w-3 h-3 rounded-full inline-block animate-pulse"
            :class="store.isStreaming ? 'bg-green-700' : 'bg-danger'"
          ></span>
          {{ store.isStreaming ? 'Live' : 'Paused' }}
        </div>

        <!-- Dark Mode Toggle -->
        <button
          class="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-bg-card text-text-primary cursor-pointer transition-all duration-300 hover:border-accent hover:text-accent"
          @click="toggleDark()"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <!-- Command Palette Trigger -->
        <button
          class="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-bg-card text-text-secondary cursor-pointer transition-all duration-300 hover:border-accent hover:text-accent"
          @click="showCommandPalette = true"
        >
          ⌘K
        </button>
      </div>
    </header>
    <!-- Connection Banner -->
    <ConnectionBanner
      :status="store.connectionStatus"
      :reconnectAttempts="store.reconnectAttempts"
      @reconnect="store.manualReconnect()"
    />
    <!-- Main Content -->
    <main class="px-6 py-6 max-w-7xl mx-auto">
      <!-- Controls -->
      <div class="mb-6">
        <DashboardControls
          :isStreaming="store.isStreaming"
          :currentRange="store.timeRange"
          @toggleStreaming="store.toggleStreaming()"
          @setRange="store.setTimeRange($event)"
        />
        <DatasetToggle
          :allSeries="store.series"
          :hiddenSeries="store.hiddenSeries"
          @toggle="store.toggleSeries($event)"
        />
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard v-for="metric in store.metrics" :key="metric.id" :metric="metric" />
      </div>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LineChart title="System Metrics" :series="store.filteredSeries" :isDark="isDark" />
        <BarChart title="Current Values" :series="store.filteredSeries" :isDark="isDark" />
      </div>

      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AreaChart title="Stacked Area Trends" :series="store.filteredSeries" :isDark="isDark" />
        <RadarChart :metrics="store.metrics" :isDark="isDark" />
      </div>
      <!-- Charts Row 3 -->
      <div class="grid grid-cols-1 mb-6">
        <CandlestickChart :isDark="isDark" />
      </div>
      <!-- Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ActivityFeed :feed="store.activityFeed" />

        <!-- Stats Summary -->
        <div class="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
          <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
            Stream Summary
          </h3>
          <div class="flex flex-col gap-3">
            <div
              v-for="metric in store.metrics"
              :key="metric.id"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-text-secondary">{{ metric.label }}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 h-2 rounded-full bg-border overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{
                      width: `${Math.min(metric.value, 100)}%`,
                      backgroundColor: seriesColor(metric.id),
                    }"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-text-primary w-16 text-right">
                  {{ metric.value.toFixed(1) }}{{ metric.unit }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- Toast Notifications -->
    <ToastNotification :feed="store.activityFeed" />
    <!-- Command Palette -->
<CommandPalette
  :show="showCommandPalette"
  :isStreaming="store.isStreaming"
  :isDark="isDark"
  @close="showCommandPalette = false"
  @toggleStreaming="store.toggleStreaming()"
  @setRange="store.setTimeRange($event)"
  @toggleDark="toggleDark()"
/>
    <!-- Keyboard Shortcuts -->
    <KeyboardShortcuts
      :show="showShortcuts"
      @open="showShortcuts = true"
      @close="showShortcuts = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useDashboardStore } from '@/stores/dashboardStore'
import ConnectionBanner from '@/components/ui/ConnectionBanner.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import CandlestickChart from '@/components/charts/CandlestickChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import ActivityFeed from '@/components/ui/ActivityFeed.vue'
import DashboardControls from '@/components/ui/DashboardControls.vue'
import DatasetToggle from '@/components/ui/DatasetToggle.vue'
import LoadingScreen from '@/components/ui/LoadingScreen.vue'
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { onMounted, onUnmounted, ref } from 'vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const store = useDashboardStore()

onUnmounted(() => store.cleanup())
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})

function seriesColor(id: string): string {
  const colors: Record<string, string> = {
    cpu: '#ad1f98',
    memory: '#e052cb',
    requests: '#767b51',
    errors: '#b9467c',
  }
  return colors[id] ?? '#ad1f98'
}

const showShortcuts = ref(false)

useKeyboardShortcuts({
  toggleStreaming: () => store.toggleStreaming(),
  setTimeRange: (range) => store.setTimeRange(range),
  toggleDark: () => toggleDark(),
})

const showCommandPalette = ref(false)

// Open command palette with Cmd+K or Ctrl+K
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      showCommandPalette.value = !showCommandPalette.value
    }
  })
})
</script>
