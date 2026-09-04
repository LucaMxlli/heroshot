import {
  BASE_THICKNESS,
  BEZEL_BOTTOM,
  BEZEL_TOP,
  DISPLAY_ARM_HEIGHT,
  DISPLAY_BEZEL,
  DISPLAY_FOOT_THICKNESS,
  DISPLAY_SCREEN_WIDTH,
  IMAC_ARM_HEIGHT,
  IMAC_BEZEL_TOP,
  IMAC_CHIN,
  IMAC_FOOT_THICKNESS,
  IMAC_SCREEN_WIDTH,
  SCREEN_WIDTH,
} from '@/lib/laptopDimensions'

const LID_TILT_FACTOR = 0.97

export interface LaptopMetrics {
  screenHeight: number
  lidHeight: number
  screenOffsetY: number
  pivotY: number
}

export function getLaptopMetrics(screenAspect: number): LaptopMetrics {
  const screenHeight = SCREEN_WIDTH / screenAspect
  const lidHeight = screenHeight + BEZEL_TOP + BEZEL_BOTTOM
  const top = BASE_THICKNESS / 2 + lidHeight * LID_TILT_FACTOR
  return {
    screenHeight,
    lidHeight,
    screenOffsetY: (BEZEL_BOTTOM - BEZEL_TOP) / 2,
    pivotY: -(top - BASE_THICKNESS / 2) / 2,
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
