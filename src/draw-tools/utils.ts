import { Ref } from "preact/hooks";

export const pixelize = (
  x: number,
  y: number,
  size: number = 10
): { x: number; y: number; w: number; h: number } => {
  var alignedX = Math.floor(x / size) * size
  var alignedY = Math.floor(y / size) * size
  return {
    x: alignedX,
    y: alignedY,
    h: size,
    w: size,
  }
}

export const pxl = (v: number, size: number = 10) => Math.floor(v / size) * size

type CursorPositionProps = { event: MouseEvent; canvas: Ref<HTMLCanvasElement> }

export const getCursorPosition = ({ event, canvas }: CursorPositionProps) => {
  const rect = canvas.current.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {
    x,
    y,
  }
}
