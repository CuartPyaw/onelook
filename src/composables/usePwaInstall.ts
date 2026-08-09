import { computed, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

const isInstalled = ref(
  window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true,
)

const canInstall = computed(() => deferredPrompt.value !== null && !isInstalled.value)

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt.value = event as BeforeInstallPromptEvent
})

window.addEventListener('appinstalled', () => {
  isInstalled.value = true
  deferredPrompt.value = null
})

async function install(): Promise<boolean> {
  const promptEvent = deferredPrompt.value
  if (!promptEvent) return false
  await promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  deferredPrompt.value = null
  return outcome === 'accepted'
}

export function usePwaInstall() {
  return { canInstall, install }
}
