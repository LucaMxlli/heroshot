let companionDragPending = false
let companionHovered = false
let mainDragPending = false
let mainHovered = false

export function markMainDrag() {
  mainDragPending = true
}

export function consumeMainDrag() {
  const pending = mainDragPending
  mainDragPending = false
  return pending
}

export function setMainHovered(value: boolean) {
  mainHovered = value
}

export function isMainHovered() {
  return mainHovered
}

export function markCompanionDrag() {
  companionDragPending = true
}

export function consumeCompanionDrag() {
  const pending = companionDragPending
  companionDragPending = false
  return pending
}

export function setCompanionHovered(value: boolean) {
  companionHovered = value
}

export function isCompanionHovered() {
  return companionHovered
}

type HitTest = (clientX: number, clientY: number) => boolean

let hitTest: HitTest | null = null

export function registerCompanionHitTest(fn: HitTest) {
  hitTest = fn
  return () => {
    if (hitTest === fn) hitTest = null
  }
}

export function isPointOverCompanion(clientX: number, clientY: number) {
  return hitTest ? hitTest(clientX, clientY) : false
}

let companionObject: unknown = null

export function setCompanionObject(object: unknown) {
  companionObject = object
}

export function getCompanionObject() {
  return companionObject
}
