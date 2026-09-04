'use client'

import { Button, IconButton } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import {
  BookmarkIcon,
  DownloadIcon,
  ImportIcon,
  KeyboardIcon,
  PanelIcon,
  RedoIcon,
  ResetIcon,
  UndoIcon,
  UploadIcon,
} from '@/components/ui/Icons'
import { useEditorStore } from '@/hooks/useEditorStore'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useScenePresets } from '@/hooks/useScenePresets'

interface TopBarProps {
  onExport: () => void
  onShortcuts: () => void
}

export function TopBar({ onExport, onShortcuts }: TopBarProps) {
  const canUndo = useEditorStore((state) => state.past.length > 0)
  const canRedo = useEditorStore((state) => state.future.length > 0)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const resetAll = useEditorStore((state) => state.resetAll)
  const toggleSidebar = useEditorStore((state) => state.toggleSidebar)
  const screenName = useEditorStore((state) => state.doc.screen?.name ?? null)
  const { openPicker } = useImageUpload()
  const { saveCurrent, importPreset } = useScenePresets()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--app-border)] bg-[var(--app-panel)] px-3">
      <Tooltip label="Toggle panel" shortcut="B" side="bottom">
        <IconButton onClick={toggleSidebar} aria-label="Toggle controls panel" className="md:hidden">
          <PanelIcon />
        </IconButton>
      </Tooltip>

      <div className="flex items-center gap-2 pl-1 pr-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/heroshot-mark.svg" alt="" width={22} height={22} className="shrink-0" />
        <span className="text-[13.5px] font-semibold tracking-tight">Heroshot</span>
      </div>

      <div className="hidden min-w-0 flex-1 items-center md:flex">
        <span className="truncate text-[12.5px] text-[var(--app-ink-faint)]">
          {screenName ?? 'Demo screen'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip label="Undo" shortcut="⌘Z">
          <IconButton onClick={undo} disabled={!canUndo} aria-label="Undo">
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip label="Redo" shortcut="⌘⇧Z">
          <IconButton onClick={redo} disabled={!canRedo} aria-label="Redo">
            <RedoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip label="Reset everything">
          <IconButton onClick={resetAll} aria-label="Reset everything">
            <ResetIcon />
          </IconButton>
        </Tooltip>
        <Tooltip label="Shortcuts" shortcut="?">
          <IconButton onClick={onShortcuts} aria-label="Keyboard shortcuts">
            <KeyboardIcon />
          </IconButton>
        </Tooltip>

        <Tooltip label="Save this scene">
          <IconButton onClick={saveCurrent} aria-label="Save this scene">
            <BookmarkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip label="Import a preset">
          <IconButton onClick={() => void importPreset()} aria-label="Import a preset">
            <ImportIcon />
          </IconButton>
        </Tooltip>

        <span className="mx-1.5 hidden h-5 w-px bg-[var(--app-border)] sm:block" />

        <Button variant="secondary" size="sm" onClick={() => void openPicker()} className="hidden sm:inline-flex">
          <UploadIcon width={14} height={14} />
          Upload
        </Button>
        <Button variant="primary" size="sm" onClick={onExport}>
          <DownloadIcon width={14} height={14} />
          Export
        </Button>
      </div>
    </header>
  )
}
