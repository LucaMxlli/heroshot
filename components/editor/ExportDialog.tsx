'use client'

import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CheckIcon, DownloadIcon } from '@/components/ui/Icons'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useScenePresets } from '@/hooks/useScenePresets'
import { EXPORT_SIZES } from '@/lib/presets'
import { downloadBlob, renderExport } from '@/lib/exportBridge'
import { clamp, cx } from '@/lib/utils'

const MAX_DIMENSION = 8192

interface ExportDialogProps {
  open: boolean
  onClose: () => void
}

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const [selected, setSelected] = useState<string>('qhd')
  const [customWidth, setCustomWidth] = useState(2000)
  const [customHeight, setCustomHeight] = useState(1250)
  const [error, setError] = useState<string | null>(null)
  const [copying, setCopying] = useState(false)

  const isExporting = useEditorStore((state) => state.isExporting)
  const setExporting = useEditorStore((state) => state.setExporting)
  const notify = useEditorStore((state) => state.notify)
  const transparent = useEditorStore((state) => state.doc.background.mode === 'transparent')
  const deviceKind = useEditorStore((state) => state.doc.device.kind)
  const { exportCurrent } = useScenePresets()

  useEffect(() => {
    if (open) setError(null)
  }, [open])

  const dimensions = useMemo(() => {
    if (selected === 'custom') {
      return {
        width: clamp(Math.round(customWidth) || 1, 16, MAX_DIMENSION),
        height: clamp(Math.round(customHeight) || 1, 16, MAX_DIMENSION),
      }
    }
    const preset = EXPORT_SIZES.find((size) => size.id === selected) ?? EXPORT_SIZES[1]
    return { width: preset.width, height: preset.height }
  }, [selected, customWidth, customHeight])

  const handleExport = async () => {
    setError(null)
    setExporting(true)
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const blob = await renderExport(dimensions)
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      downloadBlob(blob, `${deviceKind}-mockup-${dimensions.width}x${dimensions.height}-${stamp}.png`)
      notify(`Exported ${dimensions.width} × ${dimensions.height} PNG`)
      onClose()
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'The export failed.')
    } finally {
      setExporting(false)
    }
  }

  const handleCopy = async () => {
    setError(null)
    setCopying(true)
    try {
      if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
        throw new Error('This browser cannot copy images to the clipboard.')
      }
      const item = new ClipboardItem({
        'image/png': renderExport(dimensions).then((blob) => blob),
      })
      await navigator.clipboard.write([item])
      notify(`Copied ${dimensions.width} × ${dimensions.height} to the clipboard`)
      onClose()
    } catch (copyError) {
      setError(copyError instanceof Error ? copyError.message : 'Copying failed.')
    } finally {
      setCopying(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Export PNG"
      description="Renders the 3D composition only. No editor interface is included."
      onClose={onClose}
      width={470}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isExporting || copying}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => void handleCopy()} disabled={isExporting || copying}>
            {copying ? 'Copying' : 'Copy'}
          </Button>
          <Button variant="primary" onClick={() => void handleExport()} disabled={isExporting}>
            {isExporting ? (
              <span className="h-3.5 w-3.5 animate-spin-slow rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <DownloadIcon width={14} height={14} />
            )}
            {isExporting ? 'Rendering' : 'Download PNG'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1.5">
          {EXPORT_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setSelected(size.id)}
              className={cx(
                'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors duration-150',
                selected === size.id
                  ? 'border-[var(--app-ink)] bg-[var(--app-muted)]'
                  : 'border-[var(--app-border)] hover:bg-[var(--app-muted)]',
              )}
            >
              <span>
                <span className="block text-[13px] font-medium">{size.label}</span>
                <span className="block text-[11.5px] tabular-nums text-[var(--app-ink-faint)]">
                  {size.width} × {size.height}
                </span>
              </span>
              {selected === size.id ? <CheckIcon width={14} height={14} /> : null}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSelected('custom')}
          className={cx(
            'flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors duration-150',
            selected === 'custom'
              ? 'border-[var(--app-ink)] bg-[var(--app-muted)]'
              : 'border-[var(--app-border)] hover:bg-[var(--app-muted)]',
          )}
        >
          <span className="text-[13px] font-medium">Custom size</span>
          {selected === 'custom' ? <CheckIcon width={14} height={14} /> : null}
        </button>

        {selected === 'custom' && (
          <div className="flex items-center gap-2">
            <NumberInput label="Width" value={customWidth} onChange={setCustomWidth} />
            <span className="pt-4 text-[var(--app-ink-faint)]">×</span>
            <NumberInput label="Height" value={customHeight} onChange={setCustomHeight} />
          </div>
        )}

        <div className="rounded-lg bg-[var(--app-muted)] px-3 py-2.5 text-[11.5px] leading-relaxed text-[var(--app-ink-soft)]">
          {transparent
            ? 'Background is transparent, so the PNG keeps its alpha channel.'
            : 'The background is rendered into the image.'}{' '}
          Very large sizes are capped by what your GPU supports.
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--app-border)] px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium">Scene preset</p>
            <p className="text-[11.5px] leading-relaxed text-[var(--app-ink-faint)]">
              Save this layout, angles and look as JSON to reuse or share.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0"
            onClick={() => exportCurrent()}
          >
            JSON
          </Button>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[12px] font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </Modal>
  )
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex-1">
      <span className="mb-1 block text-[11.5px] font-medium text-[var(--app-ink-soft)]">{label}</span>
      <input
        type="number"
        min={16}
        max={MAX_DIMENSION}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 w-full rounded-lg border border-[var(--app-border-strong)] bg-[var(--app-panel)] px-2.5 text-[13px] tabular-nums outline-none focus:border-[var(--app-ink)]"
      />
    </label>
  )
}
