import type { LaptopSpec } from '@/lib/laptopVariants'
import {
  DISPLAY_ARM_HEIGHT,
  DISPLAY_BEZEL,
  DISPLAY_FOOT_THICKNESS,
  DISPLAY_SCREEN_WIDTH,
  IMAC_ARM_HEIGHT,
  IMAC_BEZEL_TOP,
  IMAC_CHIN,
  IMAC_FOOT_THICKNESS,
  IMAC_SCREEN_WIDTH,
} from '@/lib/laptopDimensions'

const LID_TILT_FACTOR = 0.97

export interface LaptopMetrics {
  screenWidth: number
  screenHeight: number
  lidHeight: number
  screenOffsetY: number
  pivotY: number
}

export function getLaptopMetrics(
  spec: LaptopSpec,
  screenAspect: number,
  screenOnly = false,
): LaptopMetrics {
  const screenWidth = spec.baseWidth - spec.bezelSide * 2
  const screenHeight = screenWidth / screenAspect
  const lidHeight = screenHeight + spec.bezelTop + spec.bezelBottom
  const top = spec.baseThickness / 2 + lidHeight * LID_TILT_FACTOR
  return {
    screenWidth,
    screenHeight,
    lidHeight,
    screenOffsetY: (spec.bezelBottom - spec.bezelTop) / 2,
    pivotY: screenOnly ? 0 : -(top - spec.baseThickness / 2) / 2,
  }
}

export interface PanelMetrics {
  screenHeight: number
  panelHeight: number
  screenOffsetY: number
  totalHeight: number
  pivotY: number
}

export function getDisplayMetrics(screenAspect: number): PanelMetrics {
  const screenHeight = DISPLAY_SCREEN_WIDTH / screenAspect
  const panelHeight = screenHeight + DISPLAY_BEZEL * 2
  const totalHeight = DISPLAY_FOOT_THICKNESS + DISPLAY_ARM_HEIGHT + panelHeight
  return {
    screenHeight,
    panelHeight,
    screenOffsetY: 0,
    totalHeight,
    pivotY: -totalHeight / 2,
  }
}

export function getImacMetrics(screenAspect: number): PanelMetrics {
  const screenHeight = IMAC_SCREEN_WIDTH / screenAspect
  const panelHeight = screenHeight + IMAC_BEZEL_TOP + IMAC_CHIN
  const totalHeight = IMAC_FOOT_THICKNESS + IMAC_ARM_HEIGHT + panelHeight
  return {
    screenHeight,
    panelHeight,
    screenOffsetY: (IMAC_CHIN - IMAC_BEZEL_TOP) / 2,
    totalHeight,
    pivotY: -totalHeight / 2,
  }
}
