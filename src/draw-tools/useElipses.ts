import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pixelize, pxl } from "./utils"
import { cloneElement } from "preact"

type Point = { x: number, y: number }

export const useElipsis = (draw: UltimateContexter) => {
 const [lastPoint, setLastPoint] = useState<Point>(undefined)

 const [centerPoint, setCenterPoint] = useState<Point>(undefined)
 const [yPoint, setYPoint] = useState<Point>(undefined)
 const [xPoint, setXPoint] = useState<Point>(undefined)
 const [isActive, setIsActive] = useState<boolean>(false)

 const toggleActivation = () => {
  setLastPoint(undefined)
  setIsActive(prev => !prev)
 }

 const drawEllipse = (center: Point, a: number, b: number) => {
        const centerX = center.x
        const centerY = center.y

        for (let x = -a; x <= a; x++) {
            const y = Math.round(b * Math.sqrt(1 - (x * x) / (a * a)));
            drawEllipsePoints(centerX, centerY, x, y);
            drawEllipsePoints(centerX, centerY, x, -y);
        }
    }

 const drawEllipsePoints = (centerX: number, centerY: number, x: number, y: number) => {
    draw(({context}) => {
        context.drawPixel(centerX + x, centerY + y)
    })
    }

 const select = (point: Point) => {
  if (!yPoint && centerPoint) setYPoint(point) 
  if (!centerPoint) setCenterPoint(point)

  if (centerPoint && yPoint && point) {
      const x = Math.abs(centerPoint.x - yPoint.x)
      const y = Math.abs(centerPoint.y - point.y)

      drawEllipse(centerPoint, x, y)

      setCenterPoint(undefined)
      setXPoint(undefined)
      setYPoint(undefined)
  }
 }


 return {
  select,
  isActive,
  toggleActivation,
 }
}
