'use client'

import { cx } from '@/lib/utils'

interface ToggleProps {
  label: string
  hint?: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export function Toggle({ label, hint, checked, disabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'flex w-full items-center justify-between gap-3 text-left transition-opacity',
        disabled && 'opacity-40',
      )}
    >
      <span>
        <span className="block text-[12.5px] font-medium text-[var(--app-ink)]">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-[11.5px] leading-tight text-[var(--app-ink-faint)]">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className={cx(
          'relative h-[19px] w-[33px] shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-[var(--app-accent)]' : 'bg-[var(--app-border-strong)]',
        )}
      >
        <span
          className={cx(
            'absolute top-[2.5px] h-[14px] w-[14px] rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-[16.5px]' : 'translate-x-[2.5px]',
          )}
        />
      </span>
    </button>
  )
}
