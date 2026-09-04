import type { BodyFinish, ExportSize, ViewPreset } from '@/types'

export const VIEW_PRESETS: ViewPreset[] = [
  {
    id: 'hero',
    label: 'Hero',
    transform: { rotationX: -11, rotationY: 21, rotationZ: -1.5, lidAngle: 104 },
  },
  {
    id: 'front',
    label: 'Front',
    transform: { rotationX: -4, rotationY: 0, rotationZ: 0, lidAngle: 100 },
  },
  {
    id: 'left',
    label: 'Left',
    transform: { rotationX: -8, rotationY: 30, rotationZ: 0, lidAngle: 104 },
  },
  {
    id: 'right',
    label: 'Right',
    transform: { rotationX: -8, rotationY: -30, rotationZ: 0, lidAngle: 104 },
  },
  {
    id: 'top',
    label: 'Top',
    transform: { rotationX: -42, rotationY: 0, rotationZ: 0, lidAngle: 112 },
  },
  {
    id: 'iso-left',
    label: 'Iso left',
    transform: { rotationX: -22, rotationY: 38, rotationZ: -3, lidAngle: 106 },
  },
  {
    id: 'iso-right',
    label: 'Iso right',
    transform: { rotationX: -22, rotationY: -38, rotationZ: 3, lidAngle: 106 },
  },
  {
    id: 'closeup',
    label: 'Close-up',
    transform: { rotationX: -6, rotationY: 12, rotationZ: 0, lidAngle: 98 },
  },
]

export const EXPORT_SIZES: ExportSize[] = [
  { id: 'fhd', label: 'Full HD', width: 1920, height: 1080 },
  { id: 'qhd', label: '2K', width: 2560, height: 1440 },
  { id: 'uhd', label: '4K', width: 3840, height: 2160 },
  { id: 'square', label: 'Square', width: 1080, height: 1080 },
]

export interface FinishSpec {
  id: BodyFinish
  label: string
  swatch: string
  body: string
  keyboardWell: string
  key: string
  roughness: number
  metalness: number
}

export const FINISHES: FinishSpec[] = [
  {
    id: 'silver',
    label: 'Silver',
    swatch: '#d3d6da',
    body: '#b7bcc3',
    keyboardWell: '#1c1e23',
    key: '#33373f',
    roughness: 0.5,
    metalness: 0.55,
  },
  {
    id: 'graphite',
    label: 'Graphite',
    swatch: '#6f747c',
    body: '#71767e',
    keyboardWell: '#17191d',
    key: '#202329',
    roughness: 0.54,
    metalness: 0.55,
  },
  {
    id: 'midnight',
    label: 'Midnight',
    swatch: '#2c3440',
    body: '#333b48',
    keyboardWell: '#12151b',
    key: '#1a1e25',
    roughness: 0.56,
    metalness: 0.55,
  },
  {
    id: 'gold',
    label: 'Gold',
    swatch: '#e3cdb1',
    body: '#d6c1a6',
    keyboardWell: '#1f1b16',
    key: '#2a251e',
    roughness: 0.48,
    metalness: 0.55,
  },
]

export function getFinish(id: BodyFinish): FinishSpec {
  return FINISHES.find((finish) => finish.id === id) ?? FINISHES[0]
}

export const BACKGROUND_PRESETS: Array<{ id: string; label: string; from: string; to: string; angle: number }> = [
  { id: 'mist', label: 'Mist', from: '#f6f7f9', to: '#d6dae2', angle: 160 },
  { id: 'dusk', label: 'Dusk', from: '#4338ca', to: '#a21caf', angle: 145 },
  { id: 'ember', label: 'Ember', from: '#fb7185', to: '#f59e0b', angle: 150 },
  { id: 'mint', label: 'Mint', from: '#34d399', to: '#0ea5e9', angle: 155 },
  { id: 'slate', label: 'Slate', from: '#1e293b', to: '#0b1120', angle: 165 },
  { id: 'sand', label: 'Sand', from: '#fde68a', to: '#f5d0a9', angle: 140 },
]

export interface LookPreset {
  id: string
  label: string
  swatch: string
  background: Partial<import('@/types').BackgroundState>
  scene: Partial<import('@/types').SceneSettings>
}

export const LOOK_PRESETS: LookPreset[] = [
  {
    id: 'studio',
    label: 'Studio',
    swatch: 'linear-gradient(160deg,#f6f7f9,#d6dae2)',
    background: { mode: 'gradient', gradientFrom: '#f6f7f9', gradientTo: '#d6dae2', gradientAngle: 160 },
    scene: { shadowMode: 'soft', shadowIntensity: 0.55, floor: false, lightIntensity: 1, screenGloss: 0, finish: 'silver' },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    swatch: 'linear-gradient(165deg,#1e293b,#0b1120)',
    background: { mode: 'gradient', gradientFrom: '#1e293b', gradientTo: '#0b1120', gradientAngle: 165 },
    scene: { shadowMode: 'strong', shadowIntensity: 0.72, floor: true, lightIntensity: 1.2, screenGloss: 0.42, finish: 'midnight' },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    swatch: 'linear-gradient(150deg,#fb7185,#f59e0b)',
    background: { mode: 'gradient', gradientFrom: '#fb7185', gradientTo: '#f59e0b', gradientAngle: 150 },
    scene: { shadowMode: 'soft', shadowIntensity: 0.5, floor: false, lightIntensity: 1.1, screenGloss: 0.2, finish: 'gold' },
  },
  {
    id: 'aqua',
    label: 'Aqua',
    swatch: 'linear-gradient(155deg,#34d399,#0ea5e9)',
    background: { mode: 'gradient', gradientFrom: '#34d399', gradientTo: '#0ea5e9', gradientAngle: 155 },
    scene: { shadowMode: 'soft', shadowIntensity: 0.55, floor: false, lightIntensity: 1.05, screenGloss: 0.18, finish: 'silver' },
  },
  {
    id: 'paper',
    label: 'Paper',
    swatch: '#ffffff',
    background: { mode: 'solid', color: '#ffffff' },
    scene: { shadowMode: 'soft', shadowIntensity: 0.4, floor: false, lightIntensity: 1.05, screenGloss: 0, finish: 'silver' },
  },
  {
    id: 'cutout',
    label: 'Cut-out',
    swatch: 'repeating-conic-gradient(#e9e9ec 0% 25%, #ffffff 0% 50%) 50%/12px 12px',
    background: { mode: 'transparent' },
    scene: { shadowMode: 'soft', shadowIntensity: 0.45, floor: false, lightIntensity: 1, screenGloss: 0, finish: 'silver' },
  },
]

export interface ScenePreset {
  id: string
  label: string
  hint: string
  device: import('@/types').DeviceKind
  companion: Partial<import('@/types').CompanionState>
  transform: Partial<import('@/types').TransformState>
  cameraDistance: number
  background?: Partial<import('@/types').BackgroundState>
  scene?: Partial<import('@/types').SceneSettings>
}

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'duo-right',
    label: 'Duo right',
    hint: 'iPhone to the right',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 20, offsetY: -2.6, offsetZ: 7, rotationX: 0, rotationY: -18, rotationZ: 0, scale: 1 },
    transform: { rotationX: -11, rotationY: 21, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 93,
  },
  {
    id: 'duo-left',
    label: 'Duo left',
    hint: 'iPhone to the left',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: -20, offsetY: -2.6, offsetZ: 8, rotationX: 0, rotationY: 18, rotationZ: 0, scale: 1 },
    transform: { rotationX: -11, rotationY: -21, rotationZ: 1.5, positionX: 2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 93,
  },
  {
    id: 'duo-front',
    label: 'Straight on',
    hint: 'Both facing the camera',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 19.5, offsetY: -2.6, offsetZ: 6, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1 },
    transform: { rotationX: -5, rotationY: 0, rotationZ: 0, positionX: -2, positionY: 0, scale: 1, lidAngle: 100 },
    cameraDistance: 92,
  },
  {
    id: 'duo-tilted',
    label: 'Tilted duo',
    hint: 'Stronger angle, phone leaning in',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 21, offsetY: -3, offsetZ: 9, rotationX: 7, rotationY: -28, rotationZ: -4, scale: 1 },
    transform: { rotationX: -17, rotationY: 30, rotationZ: -2, positionX: -2, positionY: 0, scale: 1, lidAngle: 106 },
    cameraDistance: 97,
  },
  {
    id: 'duo-close',
    label: 'Close hero',
    hint: 'Tighter crop, phone up front',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 17, offsetY: -3.5, offsetZ: 11, rotationX: 0, rotationY: -14, rotationZ: 0, scale: 1 },
    transform: { rotationX: -9, rotationY: 16, rotationZ: -1, positionX: -3, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 76,
  },
  {
    id: 'duo-wide',
    label: 'Wide stage',
    hint: 'Plenty of empty space',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 24, offsetY: -2.5, offsetZ: 6, rotationX: 0, rotationY: -16, rotationZ: 0, scale: 1 },
    transform: { rotationX: -10, rotationY: 18, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 122,
  },
  {
    id: 'duo-above',
    label: 'From above',
    hint: 'High angle looking down',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 19, offsetY: -4, offsetZ: 8, rotationX: -22, rotationY: -14, rotationZ: 0, scale: 1 },
    transform: { rotationX: -34, rotationY: 14, rotationZ: -1, positionX: -2, positionY: 0, scale: 1, lidAngle: 112 },
    cameraDistance: 102,
  },
  {
    id: 'duo-low',
    label: 'Low angle',
    hint: 'Seen from slightly below',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 20, offsetY: -1, offsetZ: 8, rotationX: 8, rotationY: -16, rotationZ: 0, scale: 1 },
    transform: { rotationX: 10, rotationY: 18, rotationZ: -1, positionX: -2, positionY: 0, scale: 1, lidAngle: 100 },
    cameraDistance: 95,
  },
  {
    id: 'duo-front-phone',
    label: 'Phone up front',
    hint: 'Large phone, laptop behind',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 12, offsetY: -6, offsetZ: 16, rotationX: 0, rotationY: -10, rotationZ: 0, scale: 1.25 },
    transform: { rotationX: -10, rotationY: 14, rotationZ: -1, positionX: -5, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 88,
  },
  {
    id: 'duo-back-phone',
    label: 'Phone behind',
    hint: 'Small phone set back',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 22, offsetY: 2, offsetZ: -8, rotationX: 0, rotationY: -24, rotationZ: 0, scale: 0.85 },
    transform: { rotationX: -12, rotationY: 22, rotationZ: -1.5, positionX: -1, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 95,
  },
  {
    id: 'duo-iso-left',
    label: 'Iso left',
    hint: 'Isometric from the left',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 22, offsetY: -3, offsetZ: 10, rotationX: 0, rotationY: -32, rotationZ: 0, scale: 1 },
    transform: { rotationX: -22, rotationY: 38, rotationZ: -3, positionX: -2, positionY: 0, scale: 1, lidAngle: 106 },
    cameraDistance: 101,
  },
  {
    id: 'duo-iso-right',
    label: 'Iso right',
    hint: 'Isometric from the right',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: -22, offsetY: -3, offsetZ: 10, rotationX: 0, rotationY: 32, rotationZ: 0, scale: 1 },
    transform: { rotationX: -22, rotationY: -38, rotationZ: 3, positionX: 2, positionY: 0, scale: 1, lidAngle: 106 },
    cameraDistance: 101,
  },
  {
    id: 'duo-profile',
    label: 'Profile',
    hint: 'Strong side view',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 14, offsetY: -3, offsetZ: 14, rotationX: 0, rotationY: -46, rotationZ: 0, scale: 1 },
    transform: { rotationX: -8, rotationY: 58, rotationZ: -1, positionX: -2, positionY: 0, scale: 1, lidAngle: 102 },
    cameraDistance: 100,
  },
  {
    id: 'duo-leaning',
    label: 'Leaning in',
    hint: 'Phone turned toward the Mac',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 18, offsetY: -3, offsetZ: 10, rotationX: 0, rotationY: -34, rotationZ: 6, scale: 1 },
    transform: { rotationX: -12, rotationY: 24, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 92,
  },
  {
    id: 'duo-floating',
    label: 'Floating',
    hint: 'Phone lifted off the ground',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 21, offsetY: 4, offsetZ: 9, rotationX: -6, rotationY: -20, rotationZ: -3, scale: 1 },
    transform: { rotationX: -12, rotationY: 20, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 96,
  },
  {
    id: 'duo-inward',
    label: 'Twin turn',
    hint: 'Both angled inward',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 21, offsetY: -2.6, offsetZ: 8, rotationX: 0, rotationY: -40, rotationZ: 0, scale: 1 },
    transform: { rotationX: -12, rotationY: 28, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 95,
  },
  {
    id: 'duo-stacked',
    label: 'Overlap',
    hint: 'Phone crossing the laptop',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 13, offsetY: -4, offsetZ: 14, rotationX: 0, rotationY: -16, rotationZ: -2, scale: 1.1 },
    transform: { rotationX: -10, rotationY: 18, rotationZ: -1.5, positionX: -3, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 84,
  },
  {
    id: 'duo-flat',
    label: 'Flat lay feel',
    hint: 'Steep top-down angle',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 17, offsetY: -5, offsetZ: 7, rotationX: -34, rotationY: -10, rotationZ: 0, scale: 1 },
    transform: { rotationX: -46, rotationY: 10, rotationZ: -1, positionX: -2, positionY: 0, scale: 1, lidAngle: 118 },
    cameraDistance: 108,
  },
  {
    id: 'banner-pair',
    label: 'Banner pair',
    hint: 'Mac angled left, tall phone standing to the right — landing page and roll-up style',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 19.5, offsetY: -5.5, offsetZ: 13, rotationX: 1, rotationY: -9, rotationZ: -1.5, scale: 1.35 },
    transform: { rotationX: -9, rotationY: 11, rotationZ: -0.5, positionX: -3, positionY: 0, scale: 1, lidAngle: 100 },
    cameraDistance: 86,
  },
  {
    id: 'print-hero',
    label: 'Print hero',
    hint: 'Big phone in front, laptop angled behind',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 15.5, offsetY: -7, offsetZ: 21, rotationX: 3, rotationY: -12, rotationZ: -3, scale: 1.32 },
    transform: { rotationX: -8, rotationY: 13, rotationZ: -1, positionX: -4.5, positionY: 1.5, scale: 1, lidAngle: 103 },
    cameraDistance: 88,
  },
  {
    id: 'phone-reclined',
    label: 'Reclined phone',
    hint: 'Phone leaning back as if on a stand',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 18.5, offsetY: -6.5, offsetZ: 14, rotationX: -26, rotationY: -10, rotationZ: -1, scale: 1.25 },
    transform: { rotationX: -12, rotationY: 14, rotationZ: -1, positionX: -3, positionY: 0, scale: 1, lidAngle: 102 },
    cameraDistance: 88,
  },
  {
    id: 'phone-laid-back',
    label: 'Laid back',
    hint: 'Phone tilted far back, seen from above',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 17, offsetY: -7.5, offsetZ: 13, rotationX: -52, rotationY: -8, rotationZ: 0, scale: 1.2 },
    transform: { rotationX: -26, rotationY: 12, rotationZ: -1, positionX: -3, positionY: 0, scale: 1, lidAngle: 108 },
    cameraDistance: 92,
  },
  {
    id: 'cutout-duo',
    label: 'Cut-out duo',
    hint: 'Mac almost front-on, large phone in front, transparent and shadow-free for pasting into designs',
    device: 'laptop',
    companion: { kind: 'phone', offsetX: 17.2, offsetY: -2.8, offsetZ: 12.5, rotationX: 0, rotationY: -13, rotationZ: -1.5, scale: 1.28 },
    transform: { rotationX: -11, rotationY: 6, rotationZ: -1, positionX: -3, positionY: 0, scale: 1, lidAngle: 101 },
    cameraDistance: 93,
    background: { mode: 'transparent' },
    scene: { shadowMode: 'off', floor: false, screenGloss: 0, lightIntensity: 1 },
  },
  {
    id: 'mac-watch',
    label: 'Mac + Watch',
    hint: 'MacBook with the Watch in front',
    device: 'laptop',
    companion: { kind: 'watch', offsetX: 16, offsetY: -5, offsetZ: 9, rotationX: 4, rotationY: -22, rotationZ: 0, scale: 1.7 },
    transform: { rotationX: -12, rotationY: 20, rotationZ: -1.5, positionX: -2, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 88,
  },
  {
    id: 'imac-phone',
    label: 'iMac + iPhone',
    hint: 'Desktop pair',
    device: 'imac',
    companion: { kind: 'phone', offsetX: 33, offsetY: -13, offsetZ: 10, rotationX: 0, rotationY: -20, rotationZ: 0, scale: 1.3 },
    transform: { rotationX: -8, rotationY: 16, rotationZ: -1, positionX: -3, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 152,
  },
  {
    id: 'solo-mac',
    label: 'Mac only',
    hint: 'Back to a single device',
    device: 'laptop',
    companion: { kind: 'none' },
    transform: { rotationX: -11, rotationY: 21, rotationZ: -1.5, positionX: 0, positionY: 0, scale: 1, lidAngle: 104 },
    cameraDistance: 62,
  },
]
