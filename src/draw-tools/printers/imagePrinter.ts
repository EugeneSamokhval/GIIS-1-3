import { AmazingPrinter } from "../contexter"

export const printImage: AmazingPrinter = (event: Event) => {
  const file = (event.target as HTMLInputElement).files[0]
  const reader = new FileReader()

  return ({ canvas, context }) => {
    reader.onload = function (event) {
      const img = new Image()
      img.onload = function () {
        context.imageSmoothingEnabled = false

        var percent = 0.1

        const width = img.naturalWidth
        const height = img.naturalHeight

        var scaledWidth = width * percent
        var scaledHeight = height * percent

        console.log(scaledWidth, scaledHeight)
        context.drawImage(img, 0, 0, scaledWidth, scaledHeight)
        context.drawImage(
          canvas,
          0,
          0,
          scaledWidth,
          scaledHeight,
          0,
          0,
          width,
          height
        )
      }
      img.src = event.target.result as string
    }

    reader.readAsDataURL(file)
  }
}
