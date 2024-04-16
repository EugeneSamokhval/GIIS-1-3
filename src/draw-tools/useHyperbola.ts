import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pixelize, pxl } from "./utils"
import { cloneElement } from "preact"

type Point = { x: number, y: number }

export const useHyperbola = (draw: UltimateContexter) => {
    const [lastPoint, setLastPoint] = useState<Point>(undefined)

    const [centerPoint, setCenterPoint] = useState<Point>(undefined)
    const [secondPoint, setSecondPoint] = useState<Point>(undefined)
    const [isActive, setIsActive] = useState<boolean>(false)

    const toggleActivation = () => {
        setLastPoint(undefined)
        setIsActive(prev => !prev)
    }

    const drawHyperbola = (center: Point, a: number, b: number) => {
        const centerX = center.x;
        const centerY = center.y;

        for (let x = -a; x <= a; x++) {
            const y = Math.round(b * Math.sqrt(1 + (x * x) / (a * a)));
            drawHyperbolaPoints(centerX, centerY, x, y);
            drawHyperbolaPoints(centerX, centerY, x, -y);
        }
    }

    const drawHyperbolaPoints = (centerX: number, centerY: number, x: number, y: number) => {
        draw(({context}) => {
            context.drawPixel(centerX + x, centerY + y)
            context.drawPixel(centerX - x, centerY + y)
        })
    }

    const select = (point: Point) => {
        if (!centerPoint) setCenterPoint(point)

        if (centerPoint && point) {
            const x = Math.abs(centerPoint.x - point.x)
            // const y = centerPoint.y - point.y
            drawHyperbola(centerPoint, 200, 300)

            setCenterPoint(undefined)
        }
    }


    return {
        select,
        isActive,
        toggleActivation,
    }
}
