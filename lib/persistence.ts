import { DEFAULT_DOCUMENT } from '@/lib/defaults'
import type { EditorDocument } from '@/types'

const STORAGE_KEY = 'mockup-studio:doc:v1'

export function loadDocument(): EditorDocument | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<EditorDocument>
    return {
      device: { ...DEFAULT_DOCUMENT.device, ...parsed.device },
      companion: { ...DEFAULT_DOCUMENT.companion, ...parsed.companion },
      transform: { ...DEFAULT_DOCUMENT.transform, ...parsed.transform },
      background: { ...DEFAULT_DOCUMENT.background, ...parsed.background },
      scene: { ...DEFAULT_DOCUMENT.scene, ...parsed.scene },
      screen: null,
      companionScreen: null,
    }
  } catch {
    return null
  }
}

export function saveDocument(doc: EditorDocument) {
  if (typeof window === 'undefined') return
  try {
    const { screen, companionScreen, ...rest } = doc
    void screen
    void companionScreen
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
  } catch {
    // storage unavailable (private mode, quota) — settings simply do not persist
  }
}

export function clearDocument() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
