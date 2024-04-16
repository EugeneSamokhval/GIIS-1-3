import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pixelize, pxl } from "./utils"

type Point = { x: number, y: number }

export const useLiner = (draw: UltimateContexter) => {
 const [lastPoint, setLastPoint] = useState<Point>(undefined)
 const [isActive, setIsActive] = useState<boolean>(false)
 const [smoothMode, setSmoothMode] = useState<boolean>(false)

 const toggleActivation = () => {
  setLastPoint(undefined)
  setIsActive(prev => !prev)
 }

 const toggleSmoothMode = () => {
  setLastPoint(undefined)
  setSmoothMode(prev => !prev)
 }

 const drawLineCDA = (p1: Point, p2: Point) => {
  const x1 = p1.x
  const y1 = p1.y
  const x2 = p2.x
  const y2 = p2.y

  const length = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))

  const dx = (x2 - x1) / length
  const dy = (y2 - y1) / length

  let x = x1 + 0.5 * Math.sign(dx)
  let y = y1 + 0.5 * Math.sign(dy)


  draw(({ context }) => context.drawPixel(x, y))

  let i = 0
  while (i < length) {
   x = x + dx
   y = y + dy
   draw(({ context }) => context.drawPixel(x, y))
   i++
  }
 }


 const drawLineBresenham = (p1: Point, p2: Point) => {
  let x1 = Math.round(p1.x)
  let y1 = Math.round(p1.y)
  const x2 = Math.round(p2.x)
  const y2 = Math.round(p2.y)

  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  const signX = x1 < x2 ? 1 : -1;
  const signY = y1 < y2 ? 1 : -1;
  let error: number = deltaX - deltaY;

  
  draw(({ context }) => context.drawPixel(x2, y2))
  // setPixel(x2, y2);
  while (x1 !== x2 || y1 !== y2) {
   // setPixel(x1, y1);
   draw(({ context }) => context.drawPixel(x1, y1))
   const error2: number = error * 2;
   if (error2 > -deltaY) {
    error -= deltaY;
    x1 += signX;
   }
   if (error2 < deltaX) {
    error += deltaX;
    y1 += signY;
   }
  }
 }

 function drawVu(p1: Point, p2: Point): void {
  let x1 = p1.x
  let y1 = p1.y
  let x2 = p2.x
  let y2 = p2.y

  const px1 = pixelize(x1, y1)
  const px2 = pixelize(x2, y2)

  x1 = px1.x
  x2 = px2.x
  y1 = px1.y
  y2 = px2.y



  if (x2 < x1) {
   x1 += x2;
   x2 = x1 - x2;
   x1 -= x2;
   y1 += y2;
   y2 = y1 - y2;
   y1 -= y2;
  }

  const dx: number = (x2 - x1);
  const dy: number = (y2 - y1);

  if (dx === 0 || dy === 0) {
   drawLineBresenham(p1, p2)
   return;
  }


  let style
  draw(({ context }) => { style = `${context.fillStyle}` })

  let gradient: number = 0;
  if (dx > dy) {
   gradient = (dy / dx) * 10;

   let intery: number = (y1 + gradient);

   draw(({ context }) => context.drawPixel(x1, y1))

   for (let x: number = x1; x < x2; x += 10) {

    draw(({ context }) => {
     context.fillStyle = hex2rgba(style, (255 - fractionalPart(intery) * 255))

     context.drawPixel(x, Math.floor(intery))
     context.fillStyle = hex2rgba(style, fractionalPart(intery) * 255)

     context.drawPixel(x, Math.floor(intery) + 10)
    })
    intery += gradient;
   }

   draw(({ context }) => {
    context.fillStyle = style
    context.drawPixel(x2, y2)
   })

  } else {
   gradient = (dx / dy) * 10;

   let interx: number = (x1 + gradient);
   draw(({ context }) => {
    context.fillStyle = style
    context.drawPixel(x1, y1)
   })

   for (let y: number = y1; y < y2; y += 10) {

    draw(({ context }) => {
     context.fillStyle = hex2rgba(style, (255 - fractionalPart(interx) * 255))
     context.drawPixel(Math.floor(interx), y)
     context.fillStyle = hex2rgba(style, fractionalPart(interx) * 255)
     context.drawPixel(Math.floor(interx) + 10, y)
    })
    interx += gradient;
   }

   draw(({ context }) => {
    context.fillStyle = style
    context.drawPixel(x2, y2)
   })
  }
 }

 function fractionalPart(x: number): number {
  const tmp: number = Math.floor(x);
  return x - tmp;
 }

 function hex2rgba(hexa, interx) {
  var r = parseInt(hexa.slice(1, 3), 16);
  const g = parseInt(hexa.slice(3, 5), 16);
  const b = parseInt(hexa.slice(5, 7), 16);
  const a = parseInt(hexa.slice(7, 9), 16) / 255;
  const res = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + Math.round(interx) / 256 + ')'
  console.log(res)
  return res;
 }



 const select = (point: Point) => {
  if (lastPoint && point && lastPoint.x !== point.x && lastPoint.y !== point.y) {

   if (smoothMode) {
    drawVu(lastPoint, point)
   } else {
    drawLineCDA(lastPoint, point)
    if (document['debug']) console.log(`LINE [${pxl(lastPoint.x)}:${pxl(lastPoint.y)}] [${pxl(point.x)}:${pxl(point.x)}]`)
    // drawLineBresenham(lastPoint, point)
   }

   setLastPoint(point)
  }

  if (!lastPoint && point) {
   setLastPoint(point)
  }
 }


 return {
  select,
  isActive,
  toggleActivation,
  isSmoothMode: smoothMode,
  toggleSmoothMode
 }
}