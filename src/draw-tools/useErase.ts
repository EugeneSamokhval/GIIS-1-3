import { useState } from "preact/hooks"
import { AmazingPrinter, UltimateContexter } from "./contexter"

export const useErase = (contexter: UltimateContexter) => {
  const [isActive, setIsActive] = useState<boolean>(false)

  const clear: AmazingPrinter =
    ({ x, y }) =>
    ({ context }) => {
      // context.clearRect(x, y, 10, 10)
      // context.drawPixel(x, y)
      const temp = `${context.fillStyle}` 
      context.fillStyle = 'white'
      context.drawPixel(x, y)
      context.fillStyle = temp
      // context.drawPixel(x-1, y)
      // context.drawPixel(x, y+1)
      // context.drawPixel(x, y-1)

    }
  return {
    isActive,
    toggleActivation: () => setIsActive((prev) => !prev),
    clear,
  }
}
