'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/hooks/useEditorStore'
import { isHexColor } from '@/lib/utils'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value)
  const pushHistory = useEditorStore((state) => state.pushHistory)

  useEffect(() => setDraft(value), [value])

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        aria-label={label}
        onPointerDown={pushHistory}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-8 shrink-0 rounded-lg"
      />
      <div className="flex h-8 flex-1 items-center rounded-lg border border-[var(--app-border-strong)] bg-[var(--app-panel)] px-2">
        <span className="text-[12px] text-[var(--app-ink-faint)]">{label}</span>
        <input
          value={draft}
          spellCheck={false}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            if (isHexColor(next)) {
              pushHistory()
              onChange(next.trim())
            }
          }}
          onBlur={() => setDraft(value)}
          className="ml-auto w-[74px] bg-transparent text-right text-[12px] font-medium tabular-nums outline-none"
        />
      </div>
    </div>
  )
}
