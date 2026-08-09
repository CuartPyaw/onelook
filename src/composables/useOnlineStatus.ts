import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref<boolean | null>(null)

let probeTimer: number | null = null
let probing = false

// 在线时低频探测，捕捉没有 offline 事件的静默断网；
// 离线时进一步拉长间隔，避免控制台被失败的探针请求刷屏。
const ONLINE_PROBE_INTERVAL = 15_000
const OFFLINE_PROBE_INTERVAL = 60_000

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
  }, isOnline.value === false ? OFFLINE_PROBE_INTERVAL : ONLINE_PROBE_INTERVAL)
}

// 首次探测在应用挂载前就开始，避免首帧展示未经确认的状态
void refreshStatus()

export function useOnlineStatus() {
  const handleOnline = () => {
    refreshStatus()
  }

  const handleOffline = () => {
    isOnline.value = false
    scheduleNextProbe()
  }

  const handleVisibility = () => {
    // 回到标签页时补一次探测；已离线时不重复发请求，交给定时器恢复。
    if (document.visibilityState === 'visible' && isOnline.value !== false) {
      refreshStatus()
    }
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)
    scheduleNextProbe()
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    document.removeEventListener('visibilitychange', handleVisibility)
    window.removeEventListener('focus', handleVisibility)
    if (probeTimer) clearTimeout(probeTimer)
  })

  return { isOnline }
}
