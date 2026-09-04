'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DropOverlay } from '@/components/editor/DropOverlay'
import { Button } from '@/components/ui/Button'
import { ResetIcon, UploadIcon } from '@/components/ui/Icons'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useImageUpload } from '@/hooks/useImageUpload'
import { LIMITS } from '@/lib/defaults'
import { CAMERA_FOV, REFERENCE_ASPECT } from '@/lib/camera'
import {
  consumeCompanionDrag,
  consumeMainDrag,
  isCompanionHovered,
  isMainHovered,
  isPointOverCompanion,
} from '@/lib/dragTarget'
import { clamp, cx } from '@/lib/utils'

const Viewport = dynamic(() => import('@/components/three/Viewport'), {
  ssr: false,
  loading: () => <StageSkeleton />,
})

function StageSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-[var(--app-border-strong)] border-t-[var(--app-ink)]" />
        <span className="text-[12.5px] font-medium text-[var(--app-ink-faint)]">
          Preparing the studio
        </span>
      </div>
    </div>
  )
}

type DragMode = 'rotate' | 'pan' | 'companion' | 'main' | null

function wrapAngle(value: number) {
  let angle = value
  while (angle > 180) angle -= 360
  while (angle < -180) angle += 360
  return angle
}

export function CanvasStage() {
  const container = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const dragMode = useRef<DragMode>(null)
  const last = useRef({ x: 0, y: 0 })
  const pinchDistance = useRef(0)
  const dragDepth = useRef(0)

  const [dropping, setDropping] = useState(false)
  const [grabbable, setGrabbable] = useState(false)
  const [glKey, setGlKey] = useState(0)
  const [glLost, setGlLost] = useState(false)
  const recoveries = useRef(0)
  const transparent = useEditorStore((state) => state.doc.background.mode === 'transparent')
  const isProcessing = useEditorStore((state) => state.isProcessing)
  const isExporting = useEditorStore((state) => state.isExporting)
  const hasScreen = useEditorStore((state) => Boolean(state.doc.screen))
  const resetView = useEditorStore((state) => state.resetView)
  const { acceptFiles, openPicker } = useImageUpload()
  const companionUpload = useImageUpload('companion')
  const hasCompanion = useEditorStore((state) => state.doc.companion.kind !== 'none')
  const reference = useEditorStore((state) => state.reference)

  const applyZoom = useCallback((deltaDistance: number) => {
    const store = useEditorStore.getState()
    store.setScene({
      cameraDistance: clamp(
        store.doc.scene.cameraDistance + deltaDistance,
        LIMITS.cameraDistance.min,
        LIMITS.cameraDistance.max,
      ),
    })
  }, [])

  useEffect(() => {
    const stop = () => {
      pointers.current.clear()
      pinchDistance.current = 0
      dragMode.current = null
    }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('blur', stop)
    }
  }, [])

  useEffect(() => {
    const node = container.current
    if (!node) return
    const onLost = (event: Event) => {
      event.preventDefault()
      if (recoveries.current >= 3) return
      recoveries.current += 1
      window.setTimeout(() => setGlKey((value) => value + 1), 200)
    }
    node.addEventListener('webglcontextlost', onLost, true)
    return () => node.removeEventListener('webglcontextlost', onLost, true)
  }, [])

  useEffect(() => {
    const node = container.current
    if (!node) return
    let unhealthy = 0
    const nudge = () => window.dispatchEvent(new Event('resize'))
    const first = window.setTimeout(nudge, 50)
    const interval = window.setInterval(() => {
      const canvas = node.querySelector('canvas')
      const unmeasured = !canvas || (canvas.width <= 300 && canvas.height <= 150)
      let dead = false
      if (canvas) {
        const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
        dead = Boolean(gl && gl.isContextLost())
      }

      if (!unmeasured && !dead) {
        unhealthy = 0
        setGlLost(false)
        return
      }

      unhealthy += 1
      if (unhealthy === 1) {
        nudge()
        if (recoveries.current < 3) {
          recoveries.current += 1
          setGlKey((value) => value + 1)
        }
        return
      }
      if (unhealthy >= 4) setGlLost(true)
    }, 700)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(interval)
    }
  }, [glKey])

  useEffect(() => {
    const node = container.current
    if (!node) return
    let wheelTimer = 0
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (!wheelTimer) useEditorStore.getState().pushHistory()
      window.clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => {
        wheelTimer = 0
      }, 400)
      applyZoom(event.deltaY * 0.045)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      node.removeEventListener('wheel', onWheel)
      window.clearTimeout(wheelTimer)
    }
  }, [applyZoom])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button === 2) return
    ;(event.target as Element).setPointerCapture?.(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchDistance.current = Math.hypot(a.x - b.x, a.y - b.y)
      dragMode.current = null
      return
    }

    useEditorStore.getState().pushHistory()
    const grabbingCompanion = consumeCompanionDrag()
    const grabbingMain = consumeMainDrag()
    dragMode.current =
      event.shiftKey || event.button === 1
        ? 'pan'
        : grabbingCompanion
          ? 'companion'
          : grabbingMain
            ? 'main'
            : 'rotate'
    last.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragMode.current && event.buttons === 0) {
      pointers.current.clear()
      pinchDistance.current = 0
      dragMode.current = null
      return
    }
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinchDistance.current > 0) applyZoom((pinchDistance.current - distance) * 0.12)
      pinchDistance.current = distance
      return
    }

    if (!dragMode.current) return
    const dx = event.clientX - last.current.x
    const dy = event.clientY - last.current.y
    last.current = { x: event.clientX, y: event.clientY }

    const store = useEditorStore.getState()
    const { transform } = store.doc

    if (dragMode.current === 'companion' || dragMode.current === 'main') {
      const rect = container.current?.getBoundingClientRect()
      const height = rect?.height ?? 800
      const aspect = (rect?.width ?? 1200) / Math.max(height, 1)
      const fit = Math.max(1, REFERENCE_ASPECT / Math.max(aspect, 0.0001))
      const dolly = store.doc.scene.cameraDistance * fit
      const worldPerPixel =
        (2 * dolly * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180)) / Math.max(height, 1)
      if (dragMode.current === 'main') {
        store.setTransform({
          positionX: clamp(
            transform.positionX + dx * worldPerPixel,
            LIMITS.positionX.min,
            LIMITS.positionX.max,
          ),
          positionY: clamp(
            transform.positionY - dy * worldPerPixel,
            LIMITS.positionY.min,
            LIMITS.positionY.max,
          ),
        })
        return
      }

      const scale = Math.max(transform.scale, 0.05)
      const worldX = (dx * worldPerPixel) / scale
      const worldY = (-dy * worldPerPixel) / scale
      const ry = (transform.rotationY * Math.PI) / 180
      const { companion } = store.doc
      store.setCompanion({
        offsetX: clamp(companion.offsetX + worldX * Math.cos(ry), -80, 80),
        offsetY: clamp(companion.offsetY + worldY, -60, 60),
        offsetZ: clamp(companion.offsetZ + worldX * Math.sin(ry), -60, 60),
      })
      return
    }

    if (dragMode.current === 'rotate') {
      store.setTransform({
        rotationY: wrapAngle(transform.rotationY + dx * 0.34),
        rotationX: clamp(transform.rotationX - dy * 0.3, LIMITS.rotationX.min, LIMITS.rotationX.max),
      })
    } else {
      store.setTransform({
        positionX: clamp(transform.positionX + dx * 0.05, LIMITS.positionX.min, LIMITS.positionX.max),
        positionY: clamp(transform.positionY - dy * 0.05, LIMITS.positionY.min, LIMITS.positionY.max),
      })
    }
  }

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinchDistance.current = 0
    if (pointers.current.size === 0) dragMode.current = null
  }

  return (
    <div
      ref={container}
      className={cx(
        'relative flex-1 overflow-hidden',
        transparent ? 'checkerboard' : 'bg-[var(--app-stage)]',
        grabbable && 'cursor-grab active:cursor-grabbing',
      )}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => {
        if (!dragMode.current) setGrabbable(isCompanionHovered() || isMainHovered())
        onPointerMove(event)
      }}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={endPointer}
      onDoubleClick={resetView}
      onDragEnter={(event) => {
        event.preventDefault()
        dragDepth.current += 1
        setDropping(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault()
        dragDepth.current -= 1
        if (dragDepth.current <= 0) {
          dragDepth.current = 0
          setDropping(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        dragDepth.current = 0
        setDropping(false)
        const files = event.dataTransfer?.files ?? null
        const ontoCompanion =
          hasCompanion && isPointOverCompanion(event.clientX, event.clientY)
        void (ontoCompanion ? companionUpload.acceptFiles(files) : acceptFiles(files))
      }}
    >
      <div className="absolute inset-0" style={{ zIndex: reference.onTop ? 1 : 2 }}>
        <Viewport key={glKey} />
      </div>

      {reference.url && reference.visible ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reference.url}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{ opacity: reference.opacity, zIndex: reference.onTop ? 2 : 1 }}
        />
      ) : null}

      <DropOverlay visible={dropping} />

      {glLost && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--app-bg)]/85 backdrop-blur-sm">
          <div className="flex max-w-xs flex-col items-center gap-2.5 text-center">
            <p className="text-[14px] font-semibold tracking-tight">The 3D view was dropped</p>
            <p className="text-[12.5px] leading-relaxed text-[var(--app-ink-soft)]">
              Your browser ran out of graphics contexts. Your settings are saved. Reload this page, and
              close a few other 3D or video tabs if it keeps happening.
            </p>
            <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
              Reload the scene
            </Button>
          </div>
        </div>
      )}

      {(isProcessing || isExporting) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--app-bg)]/55 backdrop-blur-[2px]">
          <div className="animate-fade-up flex items-center gap-2.5 rounded-xl border border-[var(--app-border-strong)] bg-[var(--app-panel)] px-3.5 py-2.5 shadow-xl">
            <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-[var(--app-border-strong)] border-t-[var(--app-ink)]" />
            <span className="text-[13px] font-medium">
              {isExporting ? 'Rendering your export' : 'Processing image'}
            </span>
          </div>
        </div>
      )}

      {!hasScreen && !dropping && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-5">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-panel)]/90 py-1.5 pl-3.5 pr-1.5 shadow-lg backdrop-blur">
            <span className="text-[12.5px] text-[var(--app-ink-soft)]">
              Showing a demo screen — drop your own anywhere
            </span>
            <Button size="sm" variant="primary" onClick={() => void openPicker()}>
              <UploadIcon width={14} height={14} />
              Upload
            </Button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 z-20 hidden select-none flex-col gap-1 text-[11.5px] leading-tight text-[var(--app-ink-faint)] md:flex">
        <span>Drag to rotate</span>
        <span>Shift + drag to move</span>
        <span>Scroll to zoom</span>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
        <Button size="sm" variant="secondary" onClick={resetView} title="Reset view (R)">
          <ResetIcon width={14} height={14} />
          Reset view
        </Button>
      </div>
    </div>
  )
}
