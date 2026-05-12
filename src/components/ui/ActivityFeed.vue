<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        Activity Feed
      </h3>
      <span class="text-xs text-text-muted">{{ feed.length }} events</span>
    </div>

    <!-- Feed List -->
    <div class="flex flex-col gap-2 overflow-y-auto" style="max-height: 340px;">

      <!-- Empty State -->
      <div v-if="feed.length === 0" class="flex flex-col items-center justify-center py-10 text-text-muted">
        <span class="text-3xl mb-2">📭</span>
        <span class="text-sm">No events yet...</span>
      </div>

      <!-- Feed Items -->
      <TransitionGroup name="feed">
        <div
          v-for="event in feed"
          :key="event.id"
          class="flex items-start gap-3 p-3 rounded-lg border border-border transition-all duration-200"
          :class="rowBg(event.type)"
        >
          <!-- Badge -->
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
            :class="badgeClass(event.type)"
          >
            {{ event.type.toUpperCase() }}
          </span>

          <!-- Content -->
          <div class="flex flex-col gap-0.5 min-w-0">
            <span class="text-sm text-text-primary font-medium truncate">
              {{ event.message }}
            </span>
            <div class="flex items-center gap-2 text-xs text-text-muted">
              <span>{{ event.source }}</span>
              <span>·</span>
              <span>{{ formatTime(event.timestamp) }}</span>
            </div>
          </div>
        </div>
      </TransitionGroup>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityEvent } from '@/types'

defineProps<{ feed: ActivityEvent[] }>()

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function badgeClass(type: ActivityEvent['type']): string {
  return {
    info:    'bg-info/20 text-info',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error:   'bg-danger/20 text-danger',
  }[type]
}

function rowBg(type: ActivityEvent['type']): string {
  return {
    info:    'bg-info/5',
    success: 'bg-success/5',
    warning: 'bg-warning/5',
    error:   'bg-danger/5',
  }[type]
}
</script>

<style scoped>
.feed-enter-active {
  transition: all 0.3s ease;
}
.feed-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.feed-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>