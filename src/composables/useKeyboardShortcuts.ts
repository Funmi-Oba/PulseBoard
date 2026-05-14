import { onMounted, onUnmounted } from 'vue'
import type { UseDarkReturn } from '@vueuse/core'

interface ShortcutOptions {
  toggleStreaming: () => void
  setTimeRange: (range: any) => void
  toggleDark: () => void
}

export function useKeyboardShortcuts(options: ShortcutOptions) {
  function handleKeydown(e: KeyboardEvent) {
    // Ignore if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault()
        options.toggleStreaming()
        break
      case '1':
        options.setTimeRange('1m')
        break
      case '2':
        options.setTimeRange('5m')
        break
      case '3':
        options.setTimeRange('1h')
        break
      case '4':
        options.setTimeRange('live')
        break
      case 'd':
        options.toggleDark()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}