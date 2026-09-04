export const BASE_WIDTH = 31.26
export const BASE_DEPTH = 22.12
export const BASE_THICKNESS = 0.88

export const LID_WIDTH = 31.26
export const LID_HEIGHT = 21.4
export const LID_THICKNESS = 0.36

export const BEZEL_SIDE = 0.505
export const BEZEL_TOP = 0.56
export const BEZEL_BOTTOM = 1.2

export const SCREEN_WIDTH = LID_WIDTH - BEZEL_SIDE * 2
export const SCREEN_HEIGHT = LID_HEIGHT - BEZEL_TOP - BEZEL_BOTTOM
export const SCREEN_ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
export const SCREEN_OFFSET_Y = (BEZEL_BOTTOM - BEZEL_TOP) / 2

export const CORNER_RADIUS = 0.95
export const HINGE_INSET = 0.4

export const KEYBOARD_WIDTH = 24.7
export const KEYBOARD_DEPTH = 9.5
export const TRACKPAD_WIDTH = 12.9
export const TRACKPAD_DEPTH = 8.1

export const NOTCH_WIDTH = 3.25
export const NOTCH_VISIBLE_HEIGHT = 0.82
export const NOTCH_HEIGHT = 1.3
export const NOTCH_RADIUS = 0.42

export const FRONT_SCOOP_WIDTH = 6.6
export const FRONT_SCOOP_DEPTH = 0.46

export interface PortSpec {
  side: -1 | 1
  z: number
  width: number
  height: number
  radius: number
}

export const PORTS: PortSpec[] = [
  { side: -1, z: -3.1, width: 1.02, height: 0.36, radius: 0.14 },
  { side: -1, z: -0.2, width: 0.96, height: 0.3, radius: 0.15 },
  { side: -1, z: 2.1, width: 0.96, height: 0.3, radius: 0.15 },
  { side: -1, z: 4.9, width: 0.42, height: 0.42, radius: 0.21 },
  { side: 1, z: -3.0, width: 2.5, height: 0.3, radius: 0.1 },
  { side: 1, z: 0.3, width: 1.62, height: 0.58, radius: 0.1 },
  { side: 1, z: 3.1, width: 0.96, height: 0.3, radius: 0.15 },
]

export const PHONE_WIDTH = 7.15
export const PHONE_HEIGHT = 14.96
export const PHONE_THICKNESS = 0.825
export const PHONE_CORNER_RADIUS = 1.22
export const PHONE_BEZEL = 0.16
export const PHONE_SCREEN_WIDTH = PHONE_WIDTH - PHONE_BEZEL * 2
export const PHONE_SCREEN_HEIGHT = PHONE_HEIGHT - PHONE_BEZEL * 2
export const PHONE_SCREEN_ASPECT = PHONE_SCREEN_WIDTH / PHONE_SCREEN_HEIGHT

export const DISPLAY_WIDTH = 62.3
export const DISPLAY_HEIGHT = 36.2
export const DISPLAY_THICKNESS = 1.7
export const DISPLAY_BEZEL = 1.27
export const DISPLAY_CORNER_RADIUS = 1.35
export const DISPLAY_SCREEN_WIDTH = DISPLAY_WIDTH - DISPLAY_BEZEL * 2
export const DISPLAY_SCREEN_HEIGHT = DISPLAY_HEIGHT - DISPLAY_BEZEL * 2
export const DISPLAY_SCREEN_ASPECT = DISPLAY_SCREEN_WIDTH / DISPLAY_SCREEN_HEIGHT

export const DISPLAY_FOOT_WIDTH = 22
export const DISPLAY_FOOT_DEPTH = 16.5
export const DISPLAY_FOOT_THICKNESS = 1.15
export const DISPLAY_ARM_WIDTH = 11
export const DISPLAY_ARM_HEIGHT = 11.4
export const DISPLAY_ARM_DEPTH = 3.6
export const DISPLAY_TOTAL_HEIGHT =
  DISPLAY_FOOT_THICKNESS + DISPLAY_ARM_HEIGHT + DISPLAY_HEIGHT

export const IMAC_WIDTH = 54.7
export const IMAC_PANEL_HEIGHT = 36.5
export const IMAC_THICKNESS = 1.15
export const IMAC_BEZEL_SIDE = 1.3
export const IMAC_BEZEL_TOP = 1.3
export const IMAC_CHIN = 5.9
export const IMAC_CORNER_RADIUS = 1.15
export const IMAC_SCREEN_WIDTH = IMAC_WIDTH - IMAC_BEZEL_SIDE * 2
export const IMAC_SCREEN_HEIGHT = IMAC_PANEL_HEIGHT - IMAC_BEZEL_TOP - IMAC_CHIN
export const IMAC_SCREEN_ASPECT = IMAC_SCREEN_WIDTH / IMAC_SCREEN_HEIGHT
export const IMAC_SCREEN_OFFSET_Y = (IMAC_CHIN - IMAC_BEZEL_TOP) / 2
export const IMAC_ARM_WIDTH = 12
export const IMAC_ARM_HEIGHT = 9.6
export const IMAC_ARM_DEPTH = 2.1
export const IMAC_FOOT_WIDTH = 24.5
export const IMAC_FOOT_DEPTH = 14.5
export const IMAC_FOOT_THICKNESS = 0.9
export const IMAC_TOTAL_HEIGHT = IMAC_FOOT_THICKNESS + IMAC_ARM_HEIGHT + IMAC_PANEL_HEIGHT

export const WATCH_WIDTH = 3.83
export const WATCH_HEIGHT = 4.5
export const WATCH_THICKNESS = 1.07
export const WATCH_CORNER_RADIUS = 1.12
export const WATCH_BEZEL = 0.28
export const WATCH_SCREEN_WIDTH = WATCH_WIDTH - WATCH_BEZEL * 2
export const WATCH_SCREEN_HEIGHT = WATCH_HEIGHT - WATCH_BEZEL * 2
export const WATCH_SCREEN_ASPECT = WATCH_SCREEN_WIDTH / WATCH_SCREEN_HEIGHT
export const WATCH_BAND_WIDTH = 2.32
export const WATCH_BAND_LENGTH = 3.3
export const WATCH_BAND_THICKNESS = 0.42
export const WATCH_TOTAL_HEIGHT = WATCH_HEIGHT + WATCH_BAND_LENGTH * 2
