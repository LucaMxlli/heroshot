import type { PortSpec } from '@/lib/laptopDimensions'

export type LaptopModel = 'pro14' | 'pro16' | 'air13' | 'touchbar'

export interface LaptopSpec {
  id: LaptopModel
  label: string
  hint: string
  baseWidth: number
  baseDepth: number
  baseThickness: number
  lidThickness: number
  cornerRadius: number
  bezelSide: number
  bezelTop: number
  bezelBottom: number
  screenAspect: number
  keyboardWidth: number
  keyboardDepth: number
  keyboardBackMargin: number
  trackpadWidth: number
  trackpadDepth: number
  trackpadFrontMargin: number
  scoopWidth: number
  touchBar: boolean
  ports: PortSpec[]
}

const proPorts = (z: number[]): PortSpec[] => [
  { side: -1, z: z[0], width: 1.4, height: 0.46, radius: 0.23 },
  { side: -1, z: z[1], width: 1.3, height: 0.44, radius: 0.22 },
  { side: -1, z: z[2], width: 1.3, height: 0.44, radius: 0.22 },
  { side: -1, z: z[3], width: 0.48, height: 0.48, radius: 0.24 },
  { side: 1, z: z[0], width: 3.2, height: 0.4, radius: 0.18 },
  { side: 1, z: z[1] + 0.7, width: 2.2, height: 0.48, radius: 0.14 },
  { side: 1, z: z[2] + 1.1, width: 1.3, height: 0.44, radius: 0.22 },
]

export const LAPTOP_SPECS: Record<LaptopModel, LaptopSpec> = {
  pro14: {
    id: 'pro14',
    label: '14-inch',
    hint: 'Current 14-inch pro laptop',
    baseWidth: 31.26,
    baseDepth: 22.12,
    baseThickness: 0.74,
    lidThickness: 0.3,
    cornerRadius: 0.95,
    bezelSide: 0.505,
    bezelTop: 0.56,
    bezelBottom: 1.2,
    screenAspect: 1.5402,
    keyboardWidth: 24.7,
    keyboardDepth: 9.5,
    keyboardBackMargin: 1.45,
    trackpadWidth: 12.9,
    trackpadDepth: 8.1,
    trackpadFrontMargin: 1.95,
    scoopWidth: 6.6,
    touchBar: false,
    ports: proPorts([-3.3, -0.7, 1.7, 4.5]),
  },
  pro16: {
    id: 'pro16',
    label: '16-inch',
    hint: 'Larger pro laptop',
    baseWidth: 35.57,
    baseDepth: 24.81,
    baseThickness: 0.82,
    lidThickness: 0.34,
    cornerRadius: 1.05,
    bezelSide: 0.55,
    bezelTop: 0.6,
    bezelBottom: 1.3,
    screenAspect: 1.5471,
    keyboardWidth: 27.5,
    keyboardDepth: 10.4,
    keyboardBackMargin: 1.6,
    trackpadWidth: 16,
    trackpadDepth: 9.9,
    trackpadFrontMargin: 2.1,
    scoopWidth: 7.4,
    touchBar: false,
    ports: proPorts([-3.8, -0.9, 1.9, 5.1]),
  },
  air13: {
    id: 'air13',
    label: 'Air 13',
    hint: 'Thin and light 13-inch',
    baseWidth: 30.41,
    baseDepth: 21.5,
    baseThickness: 0.58,
    lidThickness: 0.27,
    cornerRadius: 0.9,
    bezelSide: 0.48,
    bezelTop: 0.52,
    bezelBottom: 1.1,
    screenAspect: 1.5385,
    keyboardWidth: 24.3,
    keyboardDepth: 9.3,
    keyboardBackMargin: 1.4,
    trackpadWidth: 12,
    trackpadDepth: 7.8,
    trackpadFrontMargin: 1.9,
    scoopWidth: 6.3,
    touchBar: false,
    ports: [
      { side: -1, z: -2.4, width: 1.25, height: 0.36, radius: 0.18 },
      { side: -1, z: -0.85, width: 1.25, height: 0.36, radius: 0.18 },
      { side: 1, z: 0.4, width: 0.42, height: 0.4, radius: 0.2 },
    ],
  },
  touchbar: {
    id: 'touchbar',
    label: 'Touch Bar',
    hint: 'Older 16-inch with a Touch Bar and thicker bezels',
    baseWidth: 35.79,
    baseDepth: 24.59,
    baseThickness: 0.92,
    lidThickness: 0.38,
    cornerRadius: 0.8,
    bezelSide: 0.95,
    bezelTop: 1.25,
    bezelBottom: 1.95,
    screenAspect: 1.6,
    keyboardWidth: 27.5,
    keyboardDepth: 9.6,
    keyboardBackMargin: 1.5,
    trackpadWidth: 16,
    trackpadDepth: 9.9,
    trackpadFrontMargin: 2.1,
    scoopWidth: 7.4,
    touchBar: true,
    ports: [
      { side: -1, z: -3.8, width: 1.35, height: 0.46, radius: 0.23 },
      { side: -1, z: -2.1, width: 1.35, height: 0.46, radius: 0.23 },
      { side: 1, z: -3.8, width: 1.35, height: 0.46, radius: 0.23 },
      { side: 1, z: -2.1, width: 1.35, height: 0.46, radius: 0.23 },
      { side: 1, z: 3.6, width: 0.48, height: 0.48, radius: 0.24 },
    ],
  },
}

export const LAPTOP_MODELS = Object.values(LAPTOP_SPECS)

export function getLaptopSpec(model: LaptopModel | undefined): LaptopSpec {
  return LAPTOP_SPECS[model ?? 'pro14'] ?? LAPTOP_SPECS.pro14
}
