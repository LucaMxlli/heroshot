'use client'

import { useState } from 'react'

import { ColorField } from '@/components/controls/ColorField'
import { PresetGrid } from '@/components/controls/PresetGrid'
import { Section } from '@/components/controls/Section'
import { SegmentedControl } from '@/components/controls/SegmentedControl'
import { SliderControl } from '@/components/controls/SliderControl'
import { Toggle } from '@/components/controls/Toggle'
import { Button } from '@/components/ui/Button'
import {
  DownloadIcon,
  ImageIcon,
  KeyboardIcon,
  DisplayIcon,
  ImacIcon,
  LaptopIcon,
  LayersIcon,
  PhoneIcon,
  SlidersIcon,
  SparkIcon,
  SunIcon,
  TrashIcon,
  WatchIcon,
  UploadIcon,
} from '@/components/ui/Icons'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useScenePresets } from '@/hooks/useScenePresets'
import { LAPTOP_MODELS } from '@/lib/laptopVariants'
import type { LaptopModel } from '@/lib/laptopVariants'
import { pickImageFile } from '@/hooks/useImageUpload'
import { isAcceptedFile } from '@/lib/screenTexture'
import { useImageUpload } from '@/hooks/useImageUpload'
import { COMPANION_DEFAULTS, COMPANION_ZOOM_FACTOR } from '@/lib/defaults'
import { DEFAULT_DOCUMENT, getDeviceDistance, LIMITS } from '@/lib/defaults'
import { BACKGROUND_PRESETS, FINISHES, LOOK_PRESETS, SCENE_PRESETS } from '@/lib/presets'
import { cx } from '@/lib/utils'
import type {
  BackgroundMode,
  CompanionKind,
  DeviceKind,
  ScreenFit,
  ScreenRatio,
  ShadowMode,
} from '@/types'


const DEVICES: Array<{ value: DeviceKind; label: string; icon: React.ReactNode }> = [
  { value: 'laptop', label: 'MacBook', icon: <LaptopIcon width={16} height={16} /> },
  { value: 'phone', label: 'iPhone', icon: <PhoneIcon width={16} height={16} /> },
  { value: 'watch', label: 'Watch', icon: <WatchIcon width={16} height={16} /> },
  { value: 'imac', label: 'iMac', icon: <ImacIcon width={16} height={16} /> },
  { value: 'display', label: 'Display', icon: <DisplayIcon width={16} height={16} /> },
]

export function Sidebar() {
  const doc = useEditorStore((state) => state.doc)
  const setTransform = useEditorStore((state) => state.setTransform)
  const setBackground = useEditorStore((state) => state.setBackground)
  const setScene = useEditorStore((state) => state.setScene)
  const setDevice = useEditorStore((state) => state.setDevice)
  const setCompanion = useEditorStore((state) => state.setCompanion)
  const pushHistory = useEditorStore((state) => state.pushHistory)
  const notify = useEditorStore((state) => state.notify)
  const reference = useEditorStore((state) => state.reference)
  const setReferenceImage = useEditorStore((state) => state.setReferenceImage)
  const setReferenceOptions = useEditorStore((state) => state.setReferenceOptions)
  const { openPicker, clearScreen } = useImageUpload()
  const companionUpload = useImageUpload('companion')
  const { presets: customPresets, applyPreset: applyPresetFile, removePreset: removeCustomPreset, downloadPreset } = useScenePresets()

  const { transform, background, scene, device, screen, companion, companionScreen } = doc
  const isPhone = device.kind === 'phone'
  const isScreenOnly = device.kind === 'laptop' && device.screenOnly

  const changeDevice = (kind: DeviceKind) => {
    if (kind === device.kind) return
    pushHistory()
    setDevice({ kind })
    setScene({ cameraDistance: getDeviceDistance({ ...device, kind }) })
  }

  const changeScreenOnly = (screenOnly: boolean) => {
    pushHistory()
    setDevice({ screenOnly })
    const distance = getDeviceDistance({ ...device, screenOnly })
    setScene({
      cameraDistance: companion.kind === 'none' ? distance : distance * COMPANION_ZOOM_FACTOR,
    })
  }

  const changeCompanion = (kind: CompanionKind) => {
    if (kind === companion.kind) return
    pushHistory()
    const base = COMPANION_DEFAULTS[device.kind]
    setCompanion({ kind, ...base, scale: kind === 'watch' ? 1.6 : 1 })
    if (kind === 'none') setScene({ cameraDistance: getDeviceDistance(device) })
    else setScene({ cameraDistance: getDeviceDistance(device) * COMPANION_ZOOM_FACTOR })
  }

  return (
    <aside className="panel-scroll flex w-full shrink-0 flex-col overflow-y-auto border-r border-[var(--app-border)] bg-[var(--app-panel)] md:w-[312px]">
      <Section title="Scenes" icon={<SparkIcon width={13} height={13} />}>
        <div className="grid grid-cols-3 gap-1.5">
          {SCENE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.hint}
              onClick={() => {
                pushHistory()
                setDevice({ kind: preset.device })
                setCompanion(preset.companion)
                setTransform(preset.transform)
                setScene({ cameraDistance: preset.cameraDistance, ...preset.scene })
                if (preset.background) setBackground(preset.background)
              }}
              className="rounded-lg border border-[var(--app-border)] px-1.5 py-2 text-center transition-colors duration-150 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-muted)]"
            >
              <span className="block text-[11px] font-medium leading-tight">{preset.label}</span>
            </button>
          ))}
        </div>

        {customPresets.length > 0 ? (
          <div>
            <span className="mb-1.5 block text-[12.5px] font-medium">My scenes</span>
            <div className="space-y-1">
              {customPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-1 rounded-lg border border-[var(--app-border)] pl-2.5 pr-1"
                >
                  <button
                    type="button"
                    onClick={() => applyPresetFile(preset)}
                    className="min-w-0 flex-1 truncate py-1.5 text-left text-[12px] font-medium"
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadPreset(preset)}
                    aria-label={`Export ${preset.name}`}
                    title="Export as JSON"
                    className="rounded-md p-1 text-[var(--app-ink-faint)] transition-colors hover:bg-[var(--app-muted)] hover:text-[var(--app-ink)]"
                  >
                    <DownloadIcon width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCustomPreset(preset.id)}
                    aria-label={`Delete ${preset.name}`}
                    className="rounded-md p-1 text-[var(--app-ink-faint)] transition-colors hover:bg-[var(--app-muted)] hover:text-[var(--app-ink)]"
                  >
                    <TrashIcon width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
          Save, import and export scenes from the toolbar. Presets carry layout, angles and look —
          your screenshots stay on your machine.
        </p>
      </Section>

      <Section title="Device" icon={<LaptopIcon width={13} height={13} />}>
        <div className="grid grid-cols-3 gap-1.5">
          {DEVICES.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => changeDevice(entry.value)}
              className={cx(
                'flex flex-col items-center gap-1 rounded-lg border py-2 transition-all duration-150',
                device.kind === entry.value
                  ? 'border-[var(--app-ink)] bg-[var(--app-muted)] text-[var(--app-ink)]'
                  : 'border-[var(--app-border)] text-[var(--app-ink-soft)] hover:border-[var(--app-border-strong)] hover:bg-[var(--app-muted)]',
              )}
            >
              {entry.icon}
              <span className="text-[11px] font-medium leading-none">{entry.label}</span>
            </button>
          ))}
        </div>

        {isPhone ? (
          <SegmentedControl
            size="sm"
            value={device.orientation}
            onChange={(orientation) => {
              pushHistory()
              setDevice({ orientation })
            }}
            options={[
              { value: 'portrait', label: 'Portrait' },
              { value: 'landscape', label: 'Landscape' },
            ]}
          />
        ) : null}

        {device.kind === 'laptop' ? (
          <div>
            <span className="mb-1.5 block text-[12.5px] font-medium">Model</span>
            <div className="grid grid-cols-2 gap-1.5">
              {LAPTOP_MODELS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  title={entry.hint}
                  onClick={() => {
                    pushHistory()
                    setDevice({ laptopModel: entry.id as LaptopModel })
                  }}
                  className={cx(
                    'rounded-lg border px-2 py-1.5 text-[11.5px] font-medium transition-colors duration-150',
                    device.laptopModel === entry.id
                      ? 'border-[var(--app-ink)] bg-[var(--app-muted)] text-[var(--app-ink)]'
                      : 'border-[var(--app-border)] text-[var(--app-ink-soft)] hover:bg-[var(--app-muted)]',
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <div className="mt-2.5">
              <Toggle
                label="Screen only"
                hint="Hide the base, keyboard and hinge — just the display."
                checked={device.screenOnly}
                onChange={changeScreenOnly}
              />
            </div>
          </div>
        ) : null}

        <div>
          <span className="mb-1.5 block text-[12.5px] font-medium">Second device</span>
          <SegmentedControl<CompanionKind>
            size="sm"
            value={companion.kind}
            onChange={changeCompanion}
            options={[
              { value: 'none', label: 'None' },
              { value: 'phone', label: 'iPhone' },
              { value: 'watch', label: 'Watch' },
            ]}
          />
          {companion.kind !== 'none' ? (
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
              Drag it straight in the preview to place it.
            </p>
          ) : null}
        </div>

        <div>
          <span className="mb-1.5 block text-[12.5px] font-medium">Finish</span>
          <div className="flex gap-1.5">
            {FINISHES.map((finish) => (
              <button
                key={finish.id}
                type="button"
                title={finish.label}
                aria-label={finish.label}
                onClick={() => {
                  pushHistory()
                  setScene({ finish: finish.id })
                }}
                className={cx(
                  'h-8 flex-1 rounded-lg border transition-all duration-150',
                  scene.finish === finish.id
                    ? 'border-[var(--app-ink)] ring-2 ring-[var(--app-ring)]'
                    : 'border-[var(--app-border-strong)] hover:scale-[1.03]',
                )}
                style={{ background: finish.swatch }}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Screen" icon={<ImageIcon width={13} height={13} />}>
        <Button variant="primary" className="w-full" onClick={() => void openPicker()}>
          <UploadIcon width={14} height={14} />
          Upload screenshot
        </Button>
        <SegmentedControl<ScreenRatio>
          size="sm"
          value={scene.screenRatio}
          onChange={(screenRatio) => {
            pushHistory()
            setScene({ screenRatio })
          }}
          options={[
            { value: 'device', label: 'Device ratio', title: 'Keep the real display proportions' },
            { value: 'image', label: 'Match image', title: 'Reshape the display to your screenshot' },
          ]}
        />
        <SegmentedControl<ScreenFit>
          size="sm"
          value={scene.screenFit}
          onChange={(screenFit) => {
            pushHistory()
            setScene({ screenFit })
          }}
          options={[
            { value: 'contain', label: 'Contain', title: 'Fit the whole image inside the display' },
            { value: 'cover', label: 'Cover', title: 'Fill the display and crop the overflow' },
          ]}
        />
        <div className="grid grid-cols-2 gap-x-3">
          <SliderControl
            label="Width"
            value={scene.imageScaleX}
            min={0.4}
            max={2.5}
            step={0.01}
            precision={2}
            unit="×"
            onChange={(imageScaleX) => setScene({ imageScaleX })}
            onReset={() => setScene({ imageScaleX: 1 })}
          />
          <SliderControl
            label="Height"
            value={scene.imageScaleY}
            min={0.4}
            max={2.5}
            step={0.01}
            precision={2}
            unit="×"
            onChange={(imageScaleY) => setScene({ imageScaleY })}
            onReset={() => setScene({ imageScaleY: 1 })}
          />
          <SliderControl
            label="Shift X"
            value={scene.imageOffsetX}
            min={-0.5}
            max={0.5}
            step={0.005}
            precision={2}
            onChange={(imageOffsetX) => setScene({ imageOffsetX })}
            onReset={() => setScene({ imageOffsetX: 0 })}
          />
          <SliderControl
            label="Shift Y"
            value={scene.imageOffsetY}
            min={-0.5}
            max={0.5}
            step={0.005}
            precision={2}
            onChange={(imageOffsetY) => setScene({ imageOffsetY })}
            onReset={() => setScene({ imageOffsetY: 0 })}
          />
        </div>
        {screen ? (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-muted)] px-2.5 py-2">
            <ImageIcon width={14} height={14} className="shrink-0 text-[var(--app-ink-faint)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium">{screen.name}</p>
              <p className="text-[11px] text-[var(--app-ink-faint)]">
                {screen.width} × {screen.height}
              </p>
            </div>
            <button
              type="button"
              onClick={clearScreen}
              aria-label="Remove screenshot"
              className="rounded-md p-1 text-[var(--app-ink-faint)] transition-colors hover:bg-[var(--app-border)] hover:text-[var(--app-ink)]"
            >
              <TrashIcon width={14} height={14} />
            </button>
          </div>
        ) : (
          <p className="text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
            PNG, JPG or WEBP. The image is fitted inside the display and keeps its aspect ratio.
          </p>
        )}

        {companion.kind !== 'none' ? (
          <div className="mt-1 border-t border-[var(--app-border)] pt-3">
            <span className="mb-1.5 block text-[12.5px] font-medium">
              {companion.kind === 'phone' ? 'iPhone screen' : 'Watch screen'}
            </span>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => void companionUpload.openPicker()}
            >
              <UploadIcon width={14} height={14} />
              {companionScreen ? 'Replace screenshot' : 'Upload screenshot'}
            </Button>
            {companionScreen ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-muted)] px-2.5 py-2">
                <ImageIcon width={14} height={14} className="shrink-0 text-[var(--app-ink-faint)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{companionScreen.name}</p>
                  <p className="text-[11px] text-[var(--app-ink-faint)]">
                    {companionScreen.width} × {companionScreen.height}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={companionUpload.clearScreen}
                  aria-label="Remove second screenshot"
                  className="rounded-md p-1 text-[var(--app-ink-faint)] transition-colors hover:bg-[var(--app-border)] hover:text-[var(--app-ink)]"
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>

      <Section title="Second device" icon={<LayersIcon width={13} height={13} />}>
        {companion.kind !== 'none' ? (
          <>
            <div className="grid grid-cols-2 gap-x-3">
              <SliderControl
                label="Rotation X"
                value={companion.rotationX}
                min={-90}
                max={90}
                step={0.5}
                unit="°"
                precision={1}
                onChange={(rotationX) => setCompanion({ rotationX })}
                onReset={() => setCompanion({ rotationX: 0 })}
              />
              <SliderControl
                label="Rotation Y"
                value={companion.rotationY}
                min={-180}
                max={180}
                step={0.5}
                unit="°"
                precision={1}
                onChange={(rotationY) => setCompanion({ rotationY })}
                onReset={() => setCompanion({ rotationY: -18 })}
              />
              <SliderControl
                label="Rotation Z"
                value={companion.rotationZ}
                min={-90}
                max={90}
                step={0.5}
                unit="°"
                precision={1}
                onChange={(rotationZ) => setCompanion({ rotationZ })}
                onReset={() => setCompanion({ rotationZ: 0 })}
              />
              <SliderControl
                label="Position X"
                value={companion.offsetX}
                min={-60}
                max={60}
                step={0.2}
                precision={1}
                onChange={(offsetX) => setCompanion({ offsetX })}
                onReset={() => setCompanion({ offsetX: COMPANION_DEFAULTS[device.kind].offsetX })}
              />
              <SliderControl
                label="Position Y"
                value={companion.offsetY}
                min={-40}
                max={40}
                step={0.2}
                precision={1}
                onChange={(offsetY) => setCompanion({ offsetY })}
                onReset={() => setCompanion({ offsetY: COMPANION_DEFAULTS[device.kind].offsetY })}
              />
              <SliderControl
                label="Position Z"
                value={companion.offsetZ}
                min={-30}
                max={30}
                step={0.2}
                precision={1}
                onChange={(offsetZ) => setCompanion({ offsetZ })}
                onReset={() => setCompanion({ offsetZ: COMPANION_DEFAULTS[device.kind].offsetZ })}
              />
            </div>
            <SliderControl
              label="Scale"
              value={companion.scale}
              min={0.3}
              max={3}
              step={0.01}
              unit="×"
              precision={2}
              onChange={(scale) => setCompanion({ scale })}
              onReset={() => setCompanion({ scale: companion.kind === 'watch' ? 1.6 : 1 })}
            />
          </>
        ) : null}
      </Section>

      <Section title="View" icon={<KeyboardIcon width={13} height={13} />}>
        <SliderControl
          label="Screen brightness"
          value={scene.screenBrightness}
          min={0.35}
          max={1.5}
          step={0.01}
          precision={2}
          onChange={(screenBrightness) => setScene({ screenBrightness })}
          onReset={() => setScene({ screenBrightness: 1 })}
        />
        <SliderControl
          label="Screen finish"
          value={scene.screenGloss}
          min={0}
          max={1}
          step={0.01}
          precision={2}
          onChange={(screenGloss) => setScene({ screenGloss })}
          onReset={() => setScene({ screenGloss: 0 })}
        />
        <PresetGrid />
        <SliderControl
          label="Zoom"
          value={scene.cameraDistance}
          min={LIMITS.cameraDistance.min}
          max={LIMITS.cameraDistance.max}
          step={LIMITS.cameraDistance.step}
          precision={0}
          onChange={(cameraDistance) => setScene({ cameraDistance })}
          onReset={() => setScene({ cameraDistance: getDeviceDistance(device) })}
        />
      </Section>

      <Section title="Transform" icon={<SlidersIcon width={13} height={13} />}>
        <SliderControl
          label="Rotation X"
          value={transform.rotationX}
          {...LIMITS.rotationX}
          unit="°"
          precision={1}
          onChange={(rotationX) => setTransform({ rotationX })}
          onReset={() => setTransform({ rotationX: DEFAULT_DOCUMENT.transform.rotationX })}
        />
        <SliderControl
          label="Rotation Y"
          value={transform.rotationY}
          {...LIMITS.rotationY}
          unit="°"
          precision={1}
          onChange={(rotationY) => setTransform({ rotationY })}
          onReset={() => setTransform({ rotationY: DEFAULT_DOCUMENT.transform.rotationY })}
        />
        <SliderControl
          label="Rotation Z"
          value={transform.rotationZ}
          {...LIMITS.rotationZ}
          unit="°"
          precision={1}
          onChange={(rotationZ) => setTransform({ rotationZ })}
          onReset={() => setTransform({ rotationZ: DEFAULT_DOCUMENT.transform.rotationZ })}
        />
        <SliderControl
          label="Position X"
          value={transform.positionX}
          {...LIMITS.positionX}
          precision={1}
          onChange={(positionX) => setTransform({ positionX })}
          onReset={() => setTransform({ positionX: 0 })}
        />
        <SliderControl
          label="Position Y"
          value={transform.positionY}
          {...LIMITS.positionY}
          precision={1}
          onChange={(positionY) => setTransform({ positionY })}
          onReset={() => setTransform({ positionY: 0 })}
        />
        <SliderControl
          label="Scale"
          value={transform.scale}
          {...LIMITS.scale}
          precision={2}
          unit="×"
          onChange={(scale) => setTransform({ scale })}
          onReset={() => setTransform({ scale: 1 })}
        />
        {!isPhone && !isScreenOnly && (
          <SliderControl
            label="Screen angle"
            value={transform.lidAngle}
            {...LIMITS.lidAngle}
            unit="°"
            precision={0}
            onChange={(lidAngle) => setTransform({ lidAngle })}
            onReset={() => setTransform({ lidAngle: DEFAULT_DOCUMENT.transform.lidAngle })}
          />
        )}
      </Section>

      <Section title="Background" icon={<LayersIcon width={13} height={13} />}>
        <div>
          <span className="mb-1.5 block text-[12.5px] font-medium">Looks</span>
          <div className="grid grid-cols-6 gap-1.5">
            {LOOK_PRESETS.map((look) => (
              <button
                key={look.id}
                type="button"
                title={look.label}
                aria-label={`Look: ${look.label}`}
                onClick={() => {
                  pushHistory()
                  setBackground(look.background)
                  setScene(look.scene)
                }}
                className="h-8 rounded-lg border border-[var(--app-border-strong)] transition-transform duration-150 hover:scale-[1.06]"
                style={{ background: look.swatch }}
              />
            ))}
          </div>
        </div>

        <SegmentedControl<BackgroundMode>
          size="sm"
          value={background.mode}
          onChange={(mode) => {
            pushHistory()
            setBackground({ mode })
          }}
          options={[
            { value: 'transparent', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
          ]}
        />

        {background.mode === 'solid' && (
          <>
            <div className="flex gap-1.5">
              {['#ffffff', '#f4f4f5', '#101012', '#4f46e5'].map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color}`}
                  onClick={() => {
                    pushHistory()
                    setBackground({ color })
                  }}
                  className={cx(
                    'h-8 flex-1 rounded-lg border transition-transform duration-150 hover:scale-[1.03]',
                    background.color === color
                      ? 'border-[var(--app-ink)] ring-2 ring-[var(--app-ring)]'
                      : 'border-[var(--app-border-strong)]',
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
            <ColorField label="Colour" value={background.color} onChange={(color) => setBackground({ color })} />
          </>
        )}

        {background.mode === 'gradient' && (
          <>
            <div className="grid grid-cols-3 gap-1.5">
              {BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.label}
                  onClick={() => {
                    pushHistory()
                    setBackground({
                      gradientFrom: preset.from,
                      gradientTo: preset.to,
                      gradientAngle: preset.angle,
                    })
                  }}
                  className={cx(
                    'h-9 rounded-lg border transition-transform duration-150 hover:scale-[1.03]',
                    background.gradientFrom === preset.from && background.gradientTo === preset.to
                      ? 'border-[var(--app-ink)] ring-2 ring-[var(--app-ring)]'
                      : 'border-[var(--app-border-strong)]',
                  )}
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.from}, ${preset.to})`,
                  }}
                />
              ))}
            </div>
            <ColorField
              label="From"
              value={background.gradientFrom}
              onChange={(gradientFrom) => setBackground({ gradientFrom })}
            />
            <ColorField
              label="To"
              value={background.gradientTo}
              onChange={(gradientTo) => setBackground({ gradientTo })}
            />
            <SliderControl
              label="Direction"
              value={background.gradientAngle}
              min={0}
              max={360}
              step={1}
              unit="°"
              onChange={(gradientAngle) => setBackground({ gradientAngle })}
              onReset={() => setBackground({ gradientAngle: 160 })}
            />
          </>
        )}

        {background.mode === 'transparent' && (
          <p className="text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
            The exported PNG keeps a transparent background. The checkerboard is only shown in the
            editor.
          </p>
        )}
      </Section>

      <Section title="Reference" icon={<ImageIcon width={13} height={13} />} defaultOpen={false}>
        <p className="text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
          Lay a picture over the preview to match its angle. It is only a guide and never appears in
          the export.
        </p>
        <Button
          variant="secondary"
          className="w-full"
          onClick={async () => {
            const file = await pickImageFile()
            if (!file) return
            if (!isAcceptedFile(file)) {
              notify('Unsupported format. Use PNG, JPG or WEBP.')
              return
            }
            setReferenceImage(URL.createObjectURL(file), file.name)
          }}
        >
          <UploadIcon width={14} height={14} />
          {reference.url ? 'Replace reference' : 'Upload reference'}
        </Button>

        {reference.url ? (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-muted)] px-2.5 py-2">
              <ImageIcon width={14} height={14} className="shrink-0 text-[var(--app-ink-faint)]" />
              <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{reference.name}</p>
              <button
                type="button"
                onClick={() => setReferenceImage(null, '')}
                aria-label="Remove reference"
                className="rounded-md p-1 text-[var(--app-ink-faint)] transition-colors hover:bg-[var(--app-border)] hover:text-[var(--app-ink)]"
              >
                <TrashIcon width={14} height={14} />
              </button>
            </div>
            <SliderControl
              label="Opacity"
              value={reference.opacity}
              min={0}
              max={1}
              step={0.01}
              precision={2}
              onChange={(opacity) => setReferenceOptions({ opacity })}
              onReset={() => setReferenceOptions({ opacity: 0.5 })}
            />
            <SegmentedControl
              size="sm"
              value={reference.onTop ? 'front' : 'behind'}
              onChange={(value) => setReferenceOptions({ onTop: value === 'front' })}
              options={[
                { value: 'front', label: 'In front' },
                { value: 'behind', label: 'Behind' },
              ]}
            />
            <Toggle
              label="Show reference"
              hint="Hide it to check your work on its own"
              checked={reference.visible}
              onChange={(visible) => setReferenceOptions({ visible })}
            />
          </>
        ) : null}
      </Section>

      <Section title="Light & shadow" icon={<SunIcon width={13} height={13} />}>
        <SliderControl
          label="Light intensity"
          value={scene.lightIntensity}
          min={0.2}
          max={2.2}
          step={0.01}
          precision={2}
          onChange={(lightIntensity) => setScene({ lightIntensity })}
          onReset={() => setScene({ lightIntensity: 1 })}
        />
        <SegmentedControl<ShadowMode>
          size="sm"
          value={scene.shadowMode}
          onChange={(shadowMode) => {
            pushHistory()
            setScene({ shadowMode })
          }}
          options={[
            { value: 'off', label: 'No shadow' },
            { value: 'soft', label: 'Soft' },
            { value: 'strong', label: 'Strong' },
          ]}
        />
        <SliderControl
          label="Shadow intensity"
          value={scene.shadowIntensity}
          min={0}
          max={1}
          step={0.01}
          precision={2}
          onChange={(shadowIntensity) => setScene({ shadowIntensity })}
          onReset={() => setScene({ shadowIntensity: 0.55 })}
        />
        <Toggle
          label="Floor"
          hint={
            background.mode === 'transparent'
              ? 'Unavailable with a transparent background'
              : 'Places the device on a surface'
          }
          checked={scene.floor}
          disabled={background.mode === 'transparent'}
          onChange={(floor) => {
            pushHistory()
            setScene({ floor })
          }}
        />
      </Section>
    </aside>
  )
}
