import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pixelize, pxl } from "./utils"
import { cloneElement } from "preact"

type Point = { x: number, y: number }

export const useParabola = (draw: UltimateContexter) => {
 const [lastPoint, setLastPoint] = useState<Point>(undefined)

 const [centerPoint, setCenterPoint] = useState<Point>(undefined)
 const [yPoint, setYPoint] = useState<Point>(undefined)
 const [xPoint, setXPoint] = useState<Point>(undefined)
 const [isActive, setIsActive] = useState<boolean>(false)

 const toggleActivation = () => {
  setLastPoint(undefined)
  setIsActive(prev => !prev)
 }

 const drawParabola = (focus: Point, a: number, direction: number) => {
    const focusX = focus.x
    const focusY = focus.y

    for (let x = -a; x <= a; x++) {
        const y = direction * x * x / (2 * a);
        drawParabolaPoints(focusX, focusY, x, y);
    }
}

const drawParabolaPoints = (centerX: number, centerY: number, x: number, y: number) => {
    draw(({context}) => {
        context.drawPixel(centerX + x, centerY + y)
        context.drawPixel(centerX - x, centerY + y)
    })
}

 const select = (point: Point) => {
  if (!centerPoint) setCenterPoint(point)

  if (centerPoint &&  point) {
      const x = Math.abs(centerPoint.x - point.x)
      const y = centerPoint.y - point.y
      drawParabola(centerPoint, x, y/10)

      setCenterPoint(undefined)
  }
 }


 return {
  select,
  isActive,
  toggleActivation,
 }
}
