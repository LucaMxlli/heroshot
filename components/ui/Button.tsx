'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cx } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 select-none disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--app-accent)] text-[var(--app-accent-ink)] hover:opacity-88 active:scale-[0.985] shadow-sm',
  secondary:
    'bg-[var(--app-panel)] text-[var(--app-ink)] border border-[var(--app-border-strong)] hover:bg-[var(--app-muted)] active:scale-[0.985]',
  ghost: 'text-[var(--app-ink-soft)] hover:text-[var(--app-ink)] hover:bg-[var(--app-muted)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-[13px]',
  md: 'h-9 px-3.5 text-[13.5px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(base, variants[variant], sizes[size], className)}
      style={{ ['--tw-ring-color' as string]: 'var(--app-ring)' }}
      {...props}
    />
  )
})

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(function IconButton(
  { variant = 'ghost', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(
        base,
        variants[variant],
        'h-8 w-8 p-0 rounded-lg',
        className,
      )}
      {...props}
    />
  )
})
