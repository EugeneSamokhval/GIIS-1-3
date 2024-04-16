import { useEffect, useRef, useState } from "preact/hooks";
import { ContexterProducer, type UltimateContexter } from "./contexter";


export const useDrawler = () => {

 const canvasRef = useRef<HTMLCanvasElement>(null)

 const [contexter, setContexter] = useState<UltimateContexter>()

 useEffect(() => {
  if (canvasRef.current) {
   const contexter = ContexterProducer({ canvas: canvasRef.current, context: canvasRef.current.getContext('2d') })
   setContexter(prev => contexter)
  }

 }, [canvasRef])

 return { canvasRef, draw: contexter }
}