'use client'

import { ImageIcon } from '@/components/ui/Icons'

export function DropOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-6">
      <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-[var(--app-ink)]/45 bg-[var(--app-bg)]/70 backdrop-blur-[3px]" />
      <div className="animate-fade-up relative flex flex-col items-center gap-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--app-ink)] text-[var(--app-bg)]">
          <ImageIcon width={20} height={20} />
        </span>
        <p className="text-[14px] font-semibold tracking-tight">Drop to place on the display</p>
        <p className="text-[12.5px] text-[var(--app-ink-soft)]">
          PNG, JPG or WEBP up to 25 MB. Drop it right on a device to fill that screen.
        </p>
      </div>
    </div>
  )
}
