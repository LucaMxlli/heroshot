'use client'

import { useEditorStore } from '@/hooks/useEditorStore'

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  precision?: number
  onChange: (value: number) => void
  onReset?: () => void
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  precision = 0,
  onChange,
  onReset,
}: SliderControlProps) {
  const pushHistory = useEditorStore((state) => state.pushHistory)

  return (
    <div className="group">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label className="text-[12.5px] font-medium text-[var(--app-ink)]">{label}</label>
        <button
          type="button"
          onDoubleClick={onReset}
          title={onReset ? 'Double-click to reset' : undefined}
          className="tabular-nums text-[11.5px] font-medium text-[var(--app-ink-faint)] transition-colors group-hover:text-[var(--app-ink-soft)]"
        >
          {value.toFixed(precision)}
          {unit}
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onPointerDown={pushHistory}
        onKeyDown={(event) => {
          if (event.key.startsWith('Arrow')) pushHistory()
        }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
