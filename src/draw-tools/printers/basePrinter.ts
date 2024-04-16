import { AmazingPrinter } from "../contexter"

export const basePrinter: AmazingPrinter = ({x, y}) => {
  return ({ canvas, context }) => {
    context.drawPixel(x, y)
  }
}
