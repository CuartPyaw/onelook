import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

let probeTimer: number | null = null
let probing = false

async function probeConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 5000)
    try {
      await fetch(`/__pwa_probe__?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      })
      return true
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    return false
  }
}

async function refreshStatus() {
  if (probing) return
  probing = true
  try {
    isOnline.value = await probeConnectivity()
  } finally {
    probing = false
  }
  scheduleNextProbe()
}

function scheduleNextProbe() {
  if (probeTimer) clearTimeout(probeTimer)
  probeTimer = window.setTimeout(() => {
    refreshStatus()
  }, 5000)
}

export function useOnlineStatus() {
  const handleOnline = () => {
    refreshStatus()
  }

  const handleOffline = () => {
    isOnline.value = false
    scheduleNextProbe()
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    scheduleNextProbe()
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    if (probeTimer) clearTimeout(probeTimer)
  })

  return { isOnline }
}
