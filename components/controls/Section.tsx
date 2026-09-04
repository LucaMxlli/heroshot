'use client'

import { useState, type ReactNode } from 'react'
import { ChevronIcon } from '@/components/ui/Icons'
import { cx } from '@/lib/utils'

interface SectionProps {
  title: string
  icon?: ReactNode
  defaultOpen?: boolean
  action?: ReactNode
  children: ReactNode
}

export function Section({ title, icon, defaultOpen = true, action, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="border-b border-[var(--app-border)] last:border-b-0">
      <div className="flex items-center gap-1 px-4 pt-4 pb-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex flex-1 items-center gap-2 text-left"
          aria-expanded={open}
        >
          {icon ? <span className="text-[var(--app-ink-faint)]">{icon}</span> : null}
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--app-ink-soft)]">
            {title}
          </span>
          <ChevronIcon
            width={13}
            height={13}
            className={cx(
              'text-[var(--app-ink-faint)] transition-transform duration-200',
              open ? 'rotate-0' : '-rotate-90',
            )}
          />
        </button>
        {action}
      </div>
      <div
        className={cx(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3.5 px-4 pt-2 pb-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
