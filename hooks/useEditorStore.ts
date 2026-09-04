'use client'

import { create } from 'zustand'
import { DEFAULT_DOCUMENT, DEVICE_DISTANCE } from '@/lib/defaults'
import type { PresetFile } from '@/lib/presetIO'
import type {
  BackgroundState,
  CompanionState,
  DeviceState,
  EditorDocument,
  SceneSettings,
  ScreenSource,
  TransformState,
} from '@/types'

const HISTORY_LIMIT = 60

interface EditorState {
  doc: EditorDocument
  past: EditorDocument[]
  future: EditorDocument[]
  isProcessing: boolean
  isExporting: boolean
  isDragging: boolean
  sidebarOpen: boolean
  toast: { id: number; message: string } | null
  presets: PresetFile[]

  pushHistory: () => void
  setTransform: (patch: Partial<TransformState>) => void
  setBackground: (patch: Partial<BackgroundState>) => void
  setScene: (patch: Partial<SceneSettings>) => void
  setScreen: (screen: ScreenSource | null) => void
  setDevice: (patch: Partial<DeviceState>) => void
  setCompanion: (patch: Partial<CompanionState>) => void
  setCompanionScreen: (screen: ScreenSource | null) => void
  hydrate: (doc: EditorDocument) => void
  setPresets: (presets: PresetFile[]) => void
  applyPreset: (transform: Partial<TransformState>, cameraDistance?: number) => void

  undo: () => void
  redo: () => void
  resetView: () => void
  resetAll: () => void

  setProcessing: (value: boolean) => void
  setExporting: (value: boolean) => void
  setDragging: (value: boolean) => void
  toggleSidebar: () => void
  notify: (message: string) => void
  dismissToast: () => void
}

function cloneDoc(doc: EditorDocument): EditorDocument {
  return {
    device: { ...doc.device },
    companion: { ...doc.companion },
    companionScreen: doc.companionScreen ? { ...doc.companionScreen } : null,
    transform: { ...doc.transform },
    background: { ...doc.background },
    scene: { ...doc.scene },
    screen: doc.screen ? { ...doc.screen } : null,
  }
}

let toastId = 0

export const useEditorStore = create<EditorState>((set, get) => ({
  doc: cloneDoc(DEFAULT_DOCUMENT),
  past: [],
  future: [],
  isProcessing: false,
  isExporting: false,
  isDragging: false,
  sidebarOpen: true,
  toast: null,
  presets: [],

  pushHistory: () =>
    set((state) => ({
      past: [...state.past, cloneDoc(state.doc)].slice(-HISTORY_LIMIT),
      future: [],
    })),

  setTransform: (patch) =>
    set((state) => ({ doc: { ...state.doc, transform: { ...state.doc.transform, ...patch } } })),

  setBackground: (patch) =>
    set((state) => ({ doc: { ...state.doc, background: { ...state.doc.background, ...patch } } })),

  setScene: (patch) =>
    set((state) => ({ doc: { ...state.doc, scene: { ...state.doc.scene, ...patch } } })),

  setScreen: (screen) => set((state) => ({ doc: { ...state.doc, screen } })),

  setDevice: (patch) =>
    set((state) => ({ doc: { ...state.doc, device: { ...state.doc.device, ...patch } } })),

  setCompanion: (patch) =>
    set((state) => ({ doc: { ...state.doc, companion: { ...state.doc.companion, ...patch } } })),

  setCompanionScreen: (screen) => set((state) => ({ doc: { ...state.doc, companionScreen: screen } })),

  hydrate: (doc) => set({ doc, past: [], future: [] }),

  setPresets: (presets) => set({ presets }),

  applyPreset: (transform, cameraDistance) => {
    get().pushHistory()
    set((state) => ({
      doc: {
        ...state.doc,
        transform: { ...state.doc.transform, ...transform },
        scene: {
          ...state.doc.scene,
          cameraDistance: cameraDistance ?? state.doc.scene.cameraDistance,
        },
      },
    }))
  },

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        doc: previous,
        past: state.past.slice(0, -1),
        future: [cloneDoc(state.doc), ...state.future].slice(0, HISTORY_LIMIT),
      }
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        doc: next,
        past: [...state.past, cloneDoc(state.doc)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
      }
    }),

  resetView: () => {
    get().pushHistory()
    set((state) => ({
      doc: {
        ...state.doc,
        transform: { ...DEFAULT_DOCUMENT.transform },
        scene: { ...state.doc.scene, cameraDistance: DEVICE_DISTANCE[state.doc.device.kind] },
      },
    }))
  },

  resetAll: () => {
    get().pushHistory()
    set((state) => ({
      doc: {
        ...cloneDoc(DEFAULT_DOCUMENT),
        device: { ...state.doc.device },
        scene: {
          ...DEFAULT_DOCUMENT.scene,
          cameraDistance: DEVICE_DISTANCE[state.doc.device.kind],
        },
        screen: state.doc.screen,
      },
    }))
  },

  setProcessing: (value) => set({ isProcessing: value }),
  setExporting: (value) => set({ isExporting: value }),
  setDragging: (value) => set({ isDragging: value }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  notify: (message) => set({ toast: { id: ++toastId, message } }),
  dismissToast: () => set({ toast: null }),
}))

export const editorStore = useEditorStore
