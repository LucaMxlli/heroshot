'use client'

import { useEditorStore } from '@/hooks/useEditorStore'
import { VIEW_PRESETS } from '@/lib/presets'
import { cx } from '@/lib/utils'

export function PresetGrid() {
  const applyPreset = useEditorStore((state) => state.applyPreset)
  const transform = useEditorStore((state) => state.doc.transform)

  const activeId = VIEW_PRESETS.find(
    (preset) =>
      Math.abs((preset.transform.rotationX ?? 0) - transform.rotationX) < 0.6 &&
      Math.abs((preset.transform.rotationY ?? 0) - transform.rotationY) < 0.6,
  )?.id

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {VIEW_PRESETS.map((preset, index) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => applyPreset(preset.transform, preset.cameraDistance)}
          title={`${preset.label} — press ${index + 1}`}
          className={cx(
            'flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2 transition-all duration-150',
            preset.id === activeId
              ? 'border-[var(--app-ink)] bg-[var(--app-muted)]'
              : 'border-[var(--app-border)] hover:border-[var(--app-border-strong)] hover:bg-[var(--app-muted)]',
          )}
        >
          <PresetThumb rotationX={preset.transform.rotationX ?? 0} rotationY={preset.transform.rotationY ?? 0} />
          <span className="text-[10.5px] font-medium leading-none text-[var(--app-ink-soft)]">
            {preset.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function PresetThumb({ rotationX, rotationY }: { rotationX: number; rotationY: number }) {
  return (
    <span
      className="block h-7 w-9"
      style={{ perspective: '90px' }}
      aria-hidden="true"
    >
      <span
        className="block h-full w-full rounded-[3px] border border-current text-[var(--app-ink-faint)]"
        style={{
          transform: `rotateX(${-rotationX * 0.9}deg) rotateY(${rotationY * 0.9}deg)`,
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(160deg, color-mix(in srgb, currentColor 22%, transparent), transparent)',
        }}
      />
    </span>
  )
}
