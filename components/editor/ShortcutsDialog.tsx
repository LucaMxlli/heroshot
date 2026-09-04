'use client'

import { Modal } from '@/components/ui/Modal'

const GROUPS: Array<{ title: string; items: Array<[string, string]> }> = [
  {
    title: 'General',
    items: [
      ['U', 'Upload a screenshot'],
      ['⌘ / Ctrl + E', 'Open export'],
      ['⌘ / Ctrl + Z', 'Undo'],
      ['⌘ / Ctrl + ⇧ + Z', 'Redo'],
      ['B', 'Toggle the controls panel'],
      ['?', 'Show this dialog'],
    ],
  },
  {
    title: 'Scene',
    items: [
      ['1 – 8', 'Jump to a view preset'],
      ['R', 'Reset the view'],
      ['D', 'Switch laptop / phone'],
      ['F', 'Toggle the floor'],
      ['← → ↑ ↓', 'Nudge rotation (hold ⇧ for larger steps)'],
    ],
  },
  {
    title: 'Canvas',
    items: [
      ['Drag', 'Rotate the device'],
      ['⇧ + drag', 'Move the device'],
      ['Scroll / pinch', 'Zoom'],
      ['Double-click', 'Reset the view'],
    ],
  },
]

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Keyboard shortcuts" onClose={onClose} width={430}>
      <div className="space-y-4">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--app-ink-faint)]">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map(([keys, description]) => (
                <li key={keys} className="flex items-center justify-between gap-4">
                  <span className="text-[12.5px] text-[var(--app-ink-soft)]">{description}</span>
                  <kbd className="rounded-md border border-[var(--app-border-strong)] bg-[var(--app-muted)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--app-ink)]">
                    {keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  )
}
