export interface ExportRequest {
  width: number
  height: number
}

export type ExportRenderer = (request: ExportRequest) => Promise<Blob>

let renderer: ExportRenderer | null = null
const snapshotHandlers = new Set<() => void>()

export function registerExportRenderer(fn: ExportRenderer) {
  renderer = fn
  return () => {
    if (renderer === fn) renderer = null
  }
}

export function registerSnapshotHandler(fn: () => void) {
  snapshotHandlers.add(fn)
  return () => {
    snapshotHandlers.delete(fn)
  }
}

export function settleScene() {
  snapshotHandlers.forEach((handler) => handler())
}

export async function renderExport(request: ExportRequest): Promise<Blob> {
  if (!renderer) throw new Error('The 3D scene is not ready yet.')
  settleScene()
  return renderer(request)
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
