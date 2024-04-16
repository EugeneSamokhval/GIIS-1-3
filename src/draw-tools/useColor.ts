import { useEffect, useState } from "preact/hooks";
import { UltimateContexter } from "./contexter";

const colorPalette: { color: string; style: string }[] = [
 { color: "#756AB6", style: "bg-[#756AB6]" },
 { color: "#AC87C5", style: "bg-[#AC87C5]" },
 { color: "#E0AED0", style: "bg-[#E0AED0]" },
 { color: "#FFE5E5", style: "bg-[#FFE5E5]" },
]

export const useColor = (contexter: UltimateContexter) => {
 const [selectedColor, setSelectedColor] = useState<string>()

 useEffect(() => {
  if (contexter)
   changeColor(colorPalette[0].color)
 }, [contexter])

 const changeColor = (newColor: string) => {
  setSelectedColor(newColor)
  contexter(({ context }) => {
   context.fillStyle = newColor
  })

 }

 return {
  pallete: colorPalette.map(c => ({
   color: c.color, selectThisColor: () => changeColor(c.color),
   isSelected: selectedColor === c.color
  })),
  addNewColor: (color: string) => colorPalette.push({ color, style: `bg-[#${color}]` }),
  changeColor
 }
}