import { COMPANION_DEFAULTS, DEFAULT_DOCUMENT, LIMITS } from '@/lib/defaults'
import { clamp, createId, isHexColor } from '@/lib/utils'
import type {
  BackgroundState,
  CompanionState,
  DeviceKind,
  DeviceState,
  SceneSettings,
  TransformState,
} from '@/types'

export const PRESET_KIND = 'mockup-studio-preset'
export const PRESET_VERSION = 1
const STORAGE_KEY = 'mockup-studio:presets:v1'

export interface PresetPayload {
  device: DeviceState
  companion: CompanionState
  transform: TransformState
  background: BackgroundState
  scene: SceneSettings
}

export interface PresetFile {
  kind: typeof PRESET_KIND
  version: number
  id: string
  name: string
  createdAt: string
  payload: PresetPayload
}

const DEVICE_KINDS: DeviceKind[] = ['laptop', 'phone', 'display', 'imac', 'watch']

function num(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : fallback
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function colour(value: unknown, fallback: string) {
  return typeof value === 'string' && isHexColor(value) ? value : fallback
}

export function sanitisePayload(raw: unknown): PresetPayload {
  const input = (raw ?? {}) as Record<string, Record<string, unknown>>
  const d = input.device ?? {}
  const c = input.companion ?? {}
  const t = input.transform ?? {}
  const b = input.background ?? {}
  const s = input.scene ?? {}
  const base = DEFAULT_DOCUMENT

  const deviceKind = pick(d.kind, DEVICE_KINDS, base.device.kind)
  const fallbackOffsets = COMPANION_DEFAULTS[deviceKind]

  return {
    device: {
      kind: deviceKind,
      orientation: pick(d.orientation, ['portrait', 'landscape'] as const, base.device.orientation),
      laptopModel: pick(
        d.laptopModel,
        ['pro14', 'pro16', 'air13', 'touchbar'] as const,
        base.device.laptopModel,
      ),
      screenOnly: typeof d.screenOnly === 'boolean' ? d.screenOnly : base.device.screenOnly,
    },
    companion: {
      kind: pick(c.kind, ['none', 'phone', 'watch'] as const, base.companion.kind),
      offsetX: num(c.offsetX, fallbackOffsets.offsetX, -60, 60),
      offsetY: num(c.offsetY, fallbackOffsets.offsetY, -40, 40),
      offsetZ: num(c.offsetZ, fallbackOffsets.offsetZ, -30, 30),
      scale: num(c.scale, 1, 0.3, 3),
      rotationX: num(c.rotationX, 0, -90, 90),
      rotationY: num(c.rotationY, 0, -180, 180),
      rotationZ: num(c.rotationZ, 0, -90, 90),
    },
    transform: {
      rotationX: num(t.rotationX, base.transform.rotationX, LIMITS.rotationX.min, LIMITS.rotationX.max),
      rotationY: num(t.rotationY, base.transform.rotationY, LIMITS.rotationY.min, LIMITS.rotationY.max),
      rotationZ: num(t.rotationZ, base.transform.rotationZ, LIMITS.rotationZ.min, LIMITS.rotationZ.max),
      positionX: num(t.positionX, 0, LIMITS.positionX.min, LIMITS.positionX.max),
      positionY: num(t.positionY, 0, LIMITS.positionY.min, LIMITS.positionY.max),
      scale: num(t.scale, 1, LIMITS.scale.min, LIMITS.scale.max),
      lidAngle: num(t.lidAngle, base.transform.lidAngle, LIMITS.lidAngle.min, LIMITS.lidAngle.max),
    },
    background: {
      mode: pick(b.mode, ['transparent', 'solid', 'gradient'] as const, base.background.mode),
      color: colour(b.color, base.background.color),
      gradientFrom: colour(b.gradientFrom, base.background.gradientFrom),
      gradientTo: colour(b.gradientTo, base.background.gradientTo),
      gradientAngle: num(b.gradientAngle, base.background.gradientAngle, 0, 360),
    },
    scene: {
      screenRatio: pick(s.screenRatio, ['device', 'image'] as const, base.scene.screenRatio),
      screenFit: pick(s.screenFit, ['contain', 'cover'] as const, base.scene.screenFit),
      screenBrightness: num(s.screenBrightness, 1, 0.35, 1.5),
      screenGloss: num(s.screenGloss, 0, 0, 1),
      imageScaleX: num(s.imageScaleX, 1, 0.4, 2.5),
      imageScaleY: num(s.imageScaleY, 1, 0.4, 2.5),
      imageOffsetX: num(s.imageOffsetX, 0, -0.5, 0.5),
      imageOffsetY: num(s.imageOffsetY, 0, -0.5, 0.5),
      lightIntensity: num(s.lightIntensity, 1, 0.2, 2.2),
      shadowIntensity: num(s.shadowIntensity, 0.55, 0, 1),
      shadowMode: pick(s.shadowMode, ['off', 'soft', 'strong'] as const, base.scene.shadowMode),
      floor: typeof s.floor === 'boolean' ? s.floor : base.scene.floor,
      finish: pick(s.finish, ['silver', 'graphite', 'midnight', 'gold'] as const, base.scene.finish),
      cameraDistance: num(
        s.cameraDistance,
        base.scene.cameraDistance,
        LIMITS.cameraDistance.min,
        LIMITS.cameraDistance.max,
      ),
    },
  }
}

export function buildPresetFile(name: string, payload: PresetPayload): PresetFile {
  return {
    kind: PRESET_KIND,
    version: PRESET_VERSION,
    id: createId(),
    name: name.trim().slice(0, 60) || 'Untitled scene',
    createdAt: new Date().toISOString(),
    payload,
  }
}

export function parsePresetFile(text: string): PresetFile {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  const record = parsed as Record<string, unknown>
  if (!record || record.kind !== PRESET_KIND) {
    throw new Error('That file is not a Heroshot preset.')
  }
  const name = typeof record.name === 'string' ? record.name : 'Imported scene'
  return buildPresetFile(name, sanitisePayload(record.payload))
}

export function downloadPreset(preset: PresetFile) {
  const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const slug = preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  link.download = `${slug || 'scene'}.heroshot.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export function loadCustomPresets(): PresetFile[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) return []
    return list
      .filter((entry) => entry && entry.kind === PRESET_KIND)
      .map((entry) => buildPresetFile(entry.name ?? 'Scene', sanitisePayload(entry.payload)))
  } catch {
    return []
  }
}

export function saveCustomPresets(presets: PresetFile[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets.slice(0, 40)))
  } catch {
    // storage unavailable — custom scenes simply do not persist
  }
}

export function pickJsonFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.addEventListener('change', () => {
      resolve(input.files?.[0] ?? null)
      input.remove()
    })
    input.addEventListener('cancel', () => {
      resolve(null)
      input.remove()
    })
    input.click()
  })
}
