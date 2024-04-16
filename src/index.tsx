import { render } from "preact"
import { useRef, useState } from "preact/hooks"
import { HexAlphaColorPicker } from "react-colorful"
import { basePrinter } from "./draw-tools/printers/basePrinter"
import { printImage } from "./draw-tools/printers/imagePrinter"
import { useClear } from "./draw-tools/useClear"
import { useColor } from "./draw-tools/useColor"
import { useDrawler } from "./draw-tools/useDrawler"
import { useErase } from "./draw-tools/useErase"
import { useLiner } from "./draw-tools/useLiner"
import { getCursorPosition } from "./draw-tools/utils"
import "./styles/output.css"
import { useCircles } from "./draw-tools/useCircles"
import { useElipsis } from "./draw-tools/useElipses"
import { useParabola } from "./draw-tools/useParabola"
import { useHyperbola } from "./draw-tools/useHyperbola"

document['debug'] = true

export function App() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [mouseDown, setMouseDown] = useState(false)

  const [color, setColor] = useState("#aabbcc")
  const [colorModal, setColorModal] = useState(false)

  const { canvasRef, draw } = useDrawler()

  const {
    select,
    isActive: linerIsActiver,
    toggleActivation: linerToggleActivation,
    isSmoothMode,
    toggleSmoothMode,
  } = useLiner(draw)

  const { isActive: circlesIsActive, toggleActivation: toggleCircleActivation, select: selectCircle } = useCircles(draw);
  const { isActive: elipsIsActive, toggleActivation: toggleElipsActivation, select: selectElips } = useElipsis(draw);
  const { isActive: parabolaIsActive, toggleActivation: toggleParabolaActivation, select: selectParabola } = useParabola(draw);
  const { isActive: hyperbolaIsActive, toggleActivation: toggleHyperbolaActivation, select: selectHyperbola } = useHyperbola(draw);
  const {
    isActive: eraseIsActive,
    toggleActivation: eraseToggleActivation,
    clear: erase,
  } = useErase(draw)
  const { clear } = useClear(draw)
  const { pallete, addNewColor, changeColor } = useColor(draw)

  const pageWidth = 1000
  const pageHeight = 1000

  function downloadImage() {
    var dataURL = canvasRef.current.toDataURL("image/png")
    var a = document.createElement("a")
    a.href = dataURL
    a.download = crypto.randomUUID() + ".jpeg"
    a.click()
  }

  const onCanvasClick = (event: MouseEvent) => {
    const { x, y } = getCursorPosition({ event, canvas: canvasRef })
    if (eraseIsActive) {
      draw(erase({ x, y }))
    } else {

      if (
        !circlesIsActive &&
        !elipsIsActive &&
        !parabolaIsActive &&
        !hyperbolaIsActive
      ) draw(basePrinter({ x, y }))

      if (linerIsActiver) {
        select({ x, y })
      }
      if (circlesIsActive) {
        selectCircle({ x, y })
      }
      if (elipsIsActive) {
        selectElips({ x, y })
      }

      if (parabolaIsActive) {
        selectParabola({ x, y })
      }

      if (hyperbolaIsActive) {
        selectHyperbola({ x, y })
      }
    }
  }

  const onCanvasMouseMove = (event: MouseEvent) => {
    if (mouseDown) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (
        !circlesIsActive &&
        !elipsIsActive &&
        !parabolaIsActive && 
        !hyperbolaIsActive
      ) draw(({ context }) => context.drawPixel(x, y))
    }
  }

  const onCanvasMouseDown = () => setMouseDown(true)
  const onCanvasMouseUp = () => setMouseDown(false)

  return (
    <div class={`mx-auto mt-[25px] text-sm`} style={{ width: pageWidth }}>
      <div
        class={`
      flex mx-auto gap-[3px] mb-[3px]
      `}
      >
        <button class="btn" onClick={() => fileInput.current.click()}>
          Load file
        </button>
        <button class="btn" onClick={() => downloadImage()}>
          Save file
        </button>
        <input
          ref={fileInput}
          class={`w-0 invisible`}
          type="file"
          accept="image/*"
          onChange={(event) => draw(printImage(event))}
        />
      </div>
      <canvas
        ref={canvasRef}
        style={{ "image-rendering": "pixelated" }}
        class={`mx-auto bg-white shadow shadow-indigo-100`}
        onClick={onCanvasClick}
        onMouseDown={onCanvasMouseDown}
        onMouseUp={onCanvasMouseUp}
        onMouseMove={onCanvasMouseMove}
        width={pageWidth}
        height={pageHeight}
      ></canvas>
      <div class={`flex mx-auto gap-[3px] mt-[3px]`}>
        <button class="btn" onClick={() => draw(clear)}>
          clear
        </button>
        <button
          class={`btn ${linerIsActiver ? "btn-active" : ""}`}
          onClick={linerToggleActivation}
        >
          line
        </button>
        <button
          class={`btn ${isSmoothMode ? "btn-active" : ""}`}
          onClick={toggleSmoothMode}
        >
          ~
        </button>
        <button
          class={`btn ${eraseIsActive ? "btn-active" : ""}`}
          onClick={eraseToggleActivation}
        >
          erase
        </button>
        <button
          class={`btn ${circlesIsActive ? "btn-active" : ""}`}
          onClick={toggleCircleActivation}
        >
          circle
        </button>
        <button
          class={`btn ${elipsIsActive ? "btn-active" : ""}`}
          onClick={toggleElipsActivation}
        >
          elips
        </button>
        <button
          class={`btn ${parabolaIsActive ? "btn-active" : ""}`}
          onClick={toggleParabolaActivation}
        >
          parabola
        </button>
        <button
          class={`btn ${hyperbolaIsActive ? "btn-active" : ""}`}
          onClick={toggleHyperbolaActivation}
        >
          hyperbola
        </button>
        




        <div class="flex relative panel items-center px-2 gap-2">
          {pallete.map((c) => (
            <button
              key={c.color}
              onClick={c.selectThisColor}
              style={{ backgroundColor: c.color }}
              class={`h-4 w-4 ${c.isSelected ? "border-[1.5px]" : ""
                } border border-indigo-400 hover:border-[1.5px] transition-all duration-100 ease-in`}
            ></button>
          ))}
          <button
            onClick={() => {
              setColorModal((prev) => {
                if (prev) {
                  addNewColor(color)
                  changeColor(color)
                }
                return !prev
              })
            }}
            class="h-4 w-4 flex justify-center items-center btn border border-indigo-400"
          >
            +
          </button>
          <div
            class={`bottom-10 ${colorModal ? "visible" : "invisible"} absolute`}
          >
            <HexAlphaColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.getElementById("app"))
