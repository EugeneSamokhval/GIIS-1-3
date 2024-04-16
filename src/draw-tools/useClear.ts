import { Printer, UltimateContexter } from "./contexter";

export const useClear = (contexter: UltimateContexter) => {
 const clear: Printer = ({ context, canvas }) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
 }

 return {
  clear
 }
}