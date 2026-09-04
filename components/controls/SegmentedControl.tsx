'use client'

import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: ReactNode
  title?: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className="flex gap-0.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-muted)] p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 rounded-[6px] font-medium transition-all duration-150',
              size === 'sm' ? 'h-6.5 px-2 text-[11.5px]' : 'h-7.5 px-2.5 text-[12.5px]',
              active
                ? 'bg-[var(--app-panel)] text-[var(--app-ink)] shadow-sm'
                : 'text-[var(--app-ink-soft)] hover:text-[var(--app-ink)]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
