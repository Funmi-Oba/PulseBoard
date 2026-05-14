<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
  </Transition>

  <!-- Palette -->
  <Transition name="slide">
    <div
      v-if="show"
      class="fixed top-32 left-1/2 -translate-x-1/2 z-70 w-full max-w-lg bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
    >
      <!-- Search Input -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
        <span class="text-text-muted text-lg">🔍</span>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Type a command..."
          class="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
          @keydown.escape="$emit('close')"
          @keydown.arrow-down.prevent="moveDown"
          @keydown.arrow-up.prevent="moveUp"
          @keydown.enter.prevent="runSelected"
        />
        <kbd class="px-2 py-0.5 rounded bg-bg-primary border border-border text-xs font-mono text-text-muted">
          ESC
        </kbd>
      </div>

      <!-- Commands List -->
      <div class="max-h-72 overflow-y-auto">
        <div v-if="filteredCommands.length === 0" class="flex items-center justify-center py-8 text-text-muted text-sm">
          No commands found
        </div>
        <div
          v-for="(cmd, index) in filteredCommands"
          :key="cmd.id"
          class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150"
          :class="index === selectedIndex
            ? 'bg-accent/10 text-accent'
            : 'text-text-primary hover:bg-bg-primary'"
          @click="run(cmd)"
          @mouseover="selectedIndex = index"
        >
          <span class="text-lg w-6 text-center shrink-0">{{ cmd.icon }}</span>
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-medium">{{ cmd.label }}</span>
            <span class="text-xs text-text-muted">{{ cmd.description }}</span>
          </div>
          <kbd
            v-if="cmd.shortcut"
            class="ml-auto px-2 py-0.5 rounded bg-bg-primary border border-border text-xs font-mono text-text-muted shrink-0"
          >
            {{ cmd.shortcut }}
          </kbd>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-4 px-4 py-2 border-t border-border text-xs text-text-muted">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>ESC close</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps<{
  show: boolean
  isStreaming: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  close: []
  toggleStreaming: []
  setRange: [range: string]
  toggleDark: []
}>()

interface Command {
  id: string
  icon: string
  label: string
  description: string
  shortcut?: string
  action: () => void
}

const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const commands = computed<Command[]>(() => [
  {
    id: 'toggle-stream',
    icon: props.isStreaming ? '⏸' : '▶️',
    label: props.isStreaming ? 'Pause Stream' : 'Resume Stream',
    description: 'Toggle real-time data streaming',
    shortcut: 'Space',
    action: () => emit('toggleStreaming'),
  },
  {
    id: 'range-1m',
    icon: '⏱',
    label: 'Last 1 Minute',
    description: 'Show data from the last minute',
    shortcut: '1',
    action: () => emit('setRange', '1m'),
  },
  {
    id: 'range-5m',
    icon: '⏱',
    label: 'Last 5 Minutes',
    description: 'Show data from the last 5 minutes',
    shortcut: '2',
    action: () => emit('setRange', '5m'),
  },
  {
    id: 'range-1h',
    icon: '⏱',
    label: 'Last 1 Hour',
    description: 'Show data from the last hour',
    shortcut: '3',
    action: () => emit('setRange', '1h'),
  },
  {
    id: 'range-live',
    icon: '🔴',
    label: 'Live Mode',
    description: 'Show all real-time data',
    shortcut: '4',
    action: () => emit('setRange', 'live'),
  },
  {
    id: 'toggle-dark',
    icon: props.isDark ? '☀️' : '🌙',
    label: props.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    description: 'Toggle dark/light theme',
    shortcut: 'D',
    action: () => emit('toggleDark'),
  },
])

const filteredCommands = computed(() => {
  if (!query.value) return commands.value
  return commands.value.filter(
    (c) =>
      c.label.toLowerCase().includes(query.value.toLowerCase()) ||
      c.description.toLowerCase().includes(query.value.toLowerCase())
  )
})

function moveDown() {
  selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
}

function moveUp() {
  selectedIndex.value =
    (selectedIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
}

function run(cmd: Command) {
  cmd.action()
  emit('close')
}

function runSelected() {
  const cmd = filteredCommands.value[selectedIndex.value]
  if (cmd) run(cmd)
}

watch(
  () => props.show,
  async (val) => {
    if (val) {
      query.value = ''
      selectedIndex.value = 0
      await nextTick()
      inputRef.value?.focus()
    }
  }
)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>