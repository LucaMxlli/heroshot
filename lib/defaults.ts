import type { DeviceKind, DeviceState, EditorDocument } from '@/types'

export const DEFAULT_DOCUMENT: EditorDocument = {
  device: {
    kind: 'laptop',
    orientation: 'portrait',
    laptopModel: 'pro14',
    screenOnly: false,
  },
  companion: {
    kind: 'none',
    offsetX: 21,
    offsetY: -3.4,
    offsetZ: 7,
    scale: 1,
    rotationX: 0,
    rotationY: -18,
    rotationZ: 0,
  },
  companionScreen: null,
  transform: {
    rotationX: -11,
    rotationY: 21,
    rotationZ: -1.5,
    positionX: 0,
    positionY: 0,
    scale: 1,
    lidAngle: 104,
  },
  background: {
    mode: 'gradient',
    color: '#ffffff',
    gradientFrom: '#f6f7f9',
    gradientTo: '#d6dae2',
    gradientAngle: 160,
  },
  scene: {
    screenRatio: 'device',
    imageScaleX: 1,
    imageScaleY: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    screenBrightness: 1,
    screenFit: 'contain',
    screenGloss: 0,
    lightIntensity: 1,
    shadowIntensity: 0.55,
    shadowMode: 'soft',
    floor: false,
    finish: 'silver',
    cameraDistance: 62,
  },
  screen: null,
}

export const COMPANION_DEFAULTS: Record<DeviceKind, { offsetX: number; offsetY: number; offsetZ: number }> = {
  laptop: { offsetX: 20, offsetY: -2.6, offsetZ: 7 },
  phone: { offsetX: 9, offsetY: -1, offsetZ: 3 },
  display: { offsetX: 38, offsetY: -12, offsetZ: 9 },
  imac: { offsetX: 36, offsetY: -13, offsetZ: 9 },
  watch: { offsetX: 6, offsetY: 0, offsetZ: 2 },
}

export const COMPANION_ZOOM_FACTOR = 1.5

export const LIMITS = {
  rotationX: { min: -80, max: 80, step: 0.5 },
  rotationY: { min: -180, max: 180, step: 0.5 },
  rotationZ: { min: -45, max: 45, step: 0.5 },
  positionX: { min: -20, max: 20, step: 0.1 },
  positionY: { min: -20, max: 20, step: 0.1 },
  scale: { min: 0.3, max: 2.4, step: 0.01 },
  lidAngle: { min: 55, max: 130, step: 0.5 },
  cameraDistance: { min: 20, max: 140, step: 0.5 },
} as const

export const DEVICE_DISTANCE: Record<DeviceKind, number> = {
  laptop: 62,
  phone: 42,
  display: 108,
  imac: 126,
  watch: 26,
}

export const LAPTOP_SCREEN_ONLY_DISTANCE = 64

export function getDeviceDistance(device: DeviceState) {
  if (device.kind === 'laptop' && device.screenOnly) return LAPTOP_SCREEN_ONLY_DISTANCE
  return DEVICE_DISTANCE[device.kind]
}
