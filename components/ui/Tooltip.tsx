'use client'

import { useState, type ReactNode } from 'react'
import { cx } from '@/lib/utils'

interface TooltipProps {
  label: ReactNode
  shortcut?: string
  side?: 'top' | 'bottom'
  children: ReactNode
}

export function Tooltip({ label, shortcut, side = 'bottom', children }: TooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onPointerDown={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cx(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11.5px] font-medium tracking-tight transition-all duration-150',
          'bg-[var(--app-ink)] text-[var(--app-bg)] shadow-lg',
          side === 'bottom' ? 'top-[calc(100%+7px)]' : 'bottom-[calc(100%+7px)]',
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0.5',
        )}
      >
        {label}
        {shortcut ? <span className="ml-1.5 opacity-55">{shortcut}</span> : null}
      </span>
    </span>
  )
}
