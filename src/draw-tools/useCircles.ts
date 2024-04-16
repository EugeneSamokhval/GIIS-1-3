import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pixelize, pxl } from "./utils"

type Point = { x: number, y: number }

export const useCircles = (draw: UltimateContexter) => {
 const [lastPoint, setLastPoint] = useState<Point>(undefined)
 const [isActive, setIsActive] = useState<boolean>(false)

 const toggleActivation = () => {
  setLastPoint(undefined)
  setIsActive(prev => !prev)
 }

 const drawCircle = (center: Point, radiusPoint: Point) => {
        const centerX = center.x
        const centerY = center.y


        let radius = Math.max(Math.abs(centerX - radiusPoint.x), Math.abs(centerY - radiusPoint.y))
        let y = 0;
        let decisionOver2 = 1 - radius;

        while (radius >= y) {
            drawCirclePoints(centerX, centerY, radius, y);
            y++;

            if (decisionOver2 <= 0) {
                decisionOver2 += 2 * y + 1;
            } else {
                radius--;
                decisionOver2 += 2 * (y - radius) + 1;
            }
        }
    }


 const drawCirclePoints = (centerX: number, centerY: number, x: number, y: number) => {
  draw(({ context }) => {
        context.drawPixel(centerX + x, centerY + y);
        context.drawPixel(centerX - x, centerY + y);
        context.drawPixel(centerX + x, centerY - y);
        context.drawPixel(centerX - x, centerY - y);
        context.drawPixel(centerX + y, centerY + x);
        context.drawPixel(centerX - y, centerY + x);
        context.drawPixel(centerX + y, centerY - x);
        context.drawPixel(centerX - y, centerY - x);
  })
 }




 const select = (point: Point) => {
  if (lastPoint && point && lastPoint.x !== point.x && lastPoint.y !== point.y) {
      drawCircle(lastPoint, point)
      setLastPoint(undefined)
  }

  if (!lastPoint && point) {
   setLastPoint(point)
  }
 }


 return {
  select,
  isActive,
  toggleActivation,
 }
}
