<template>
  <div class="bg-bg-card border border-border rounded-xl p-5 transition-all duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        Activity Feed
      </h3>
      <span class="text-xs text-text-muted">{{ filteredFeed.length }} events</span>
    </div>

    <!-- Search -->
    <input
      v-model="search"
      type="text"
      placeholder="Search events..."
      class="w-full mb-3 px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-all duration-200"
    />

    <!-- Type Filters -->
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <button
        v-for="type in filterTypes"
        :key="type"
        class="px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer"
        :class="activeFilter === type
          ? activeFilterClass(type)
          : 'border-border text-text-muted hover:border-accent hover:text-accent'"
        @click="activeFilter = activeFilter === type ? null : type"
      >
        {{ type.toUpperCase() }}
      </button>
    </div>

    <!-- Feed List -->
    <div class="flex flex-col gap-2 overflow-y-auto" style="max-height: 280px;">

      <!-- Empty State -->
      <div v-if="filteredFeed.length === 0" class="flex flex-col items-center justify-center py-10 text-text-muted">
        <span class="text-3xl mb-2">📭</span>
        <span class="text-sm">No matching events...</span>
      </div>

      <!-- Feed Items -->
      <TransitionGroup name="feed">
        <div
          v-for="event in filteredFeed"
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
import { ref, computed } from 'vue'
import type { ActivityEvent } from '@/types'

const props = defineProps<{ feed: ActivityEvent[] }>()

const search = ref('')
const activeFilter = ref<ActivityEvent['type'] | null>(null)
const filterTypes: ActivityEvent['type'][] = ['info', 'success', 'warning', 'error']

const filteredFeed = computed(() => {
  return props.feed.filter((event) => {
    const matchesType = activeFilter.value ? event.type === activeFilter.value : true
    const matchesSearch = search.value
      ? event.message.toLowerCase().includes(search.value.toLowerCase()) ||
        event.source.toLowerCase().includes(search.value.toLowerCase())
      : true
    return matchesType && matchesSearch
  })
})

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

function activeFilterClass(type: ActivityEvent['type']): string {
  return {
    info:    'bg-info/20 text-info border-info',
    success: 'bg-success/20 text-success border-success',
    warning: 'bg-warning/20 text-warning border-warning',
    error:   'bg-danger/20 text-danger border-danger',
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