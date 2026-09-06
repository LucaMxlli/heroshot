export type BackgroundMode = 'transparent' | 'solid' | 'gradient'

export type ShadowMode = 'off' | 'soft' | 'strong'

export type BodyFinish = 'silver' | 'graphite' | 'midnight' | 'gold'

export type DeviceKind = 'laptop' | 'phone' | 'display' | 'imac' | 'watch'

export type PhoneOrientation = 'portrait' | 'landscape'

export type ScreenFit = 'contain' | 'cover'

export type ScreenRatio = 'device' | 'image'

export type CompanionKind = 'none' | 'phone' | 'watch'

export type ScreenSlot = 'primary' | 'companion'

export interface CompanionState {
  kind: CompanionKind
  offsetX: number
  offsetY: number
  offsetZ: number
  scale: number
  rotationX: number
  rotationY: number
  rotationZ: number
}

export interface TransformState {
  rotationX: number
  rotationY: number
  rotationZ: number
  positionX: number
  positionY: number
  scale: number
  lidAngle: number
}

export interface BackgroundState {
  mode: BackgroundMode
  color: string
  gradientFrom: string
  gradientTo: string
  gradientAngle: number
}

export interface SceneSettings {
  screenRatio: ScreenRatio
  imageScaleX: number
  imageScaleY: number
  imageOffsetX: number
  imageOffsetY: number
  screenBrightness: number
  screenFit: ScreenFit
  screenGloss: number
  lightIntensity: number
  shadowIntensity: number
  shadowMode: ShadowMode
  floor: boolean
  finish: BodyFinish
  cameraDistance: number
}

export interface ScreenSource {
  id: string
  name: string
  width: number
  height: number
}

export interface DeviceState {
  kind: DeviceKind
  orientation: PhoneOrientation
  laptopModel: import('@/lib/laptopVariants').LaptopModel
  screenOnly: boolean
}

export interface EditorDocument {
  device: DeviceState
  companion: CompanionState
  companionScreen: ScreenSource | null
  transform: TransformState
  background: BackgroundState
  scene: SceneSettings
  screen: ScreenSource | null
}

export interface ViewPreset {
  id: string
  label: string
  transform: Partial<TransformState>
  cameraDistance?: number
}

export interface DeviceSpec {
  screenAspect: number
  boundingRadius: number
  pivotY: number
}

export interface ExportSize {
  id: string
  label: string
  width: number
  height: number
}
