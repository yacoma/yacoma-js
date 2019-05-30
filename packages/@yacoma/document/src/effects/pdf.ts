import * as lib from 'pdfjs-dist'
import { PDFJSStatic } from 'pdfjs-dist'

const pdfjs: PDFJSStatic = (lib as any).default

// We use this to update pdf worker file name on library change.
pdfjs.workerSrc = `pdf.worker.${require('pdfjs-dist/package.json').version}.js`
// The worker should be created with the following webpack (or similar) config:
/*
new CopyWebpackPlugin([
  {
    from: require.resolve('pdfjs-dist/build/pdf.worker.js'),
    to: `dist/pdf.worker.${require('pdfjs-dist/package.json').version}.js`,
  },
]),
*/

export interface PDFViewOptions {
  // Render to fixed width
  width?: number
}

export function showPDF(
  parentDiv: HTMLDivElement,
  url: string,
  opts: PDFViewOptions = {}
) {
  // delete all previous elements in parentDiv
  const loading = parentDiv.querySelector<HTMLElement>('.Loading')
  if (loading) {
    loading.style.display = 'block'
  }

  while (parentDiv.querySelector('canvas')) {
    parentDiv.removeChild(parentDiv.querySelector('canvas')!)
  }

  // Loading a document.
  return new Promise((resolve, reject) =>
    pdfjs.getDocument(url).then(async pdfDocument => {
      for (let pageIdx = 1; pageIdx <= pdfDocument.numPages; ++pageIdx) {
        const page = await pdfDocument.getPage(pageIdx)
        //This gives us the page's dimensions at full scale
        const viewport = opts.width
          ? page.getViewport(opts.width / page.getViewport(1.0).width)
          : page.getViewport(1.0)

        //We'll create a canvas for each page to draw it on
        const canvas = document.createElement('canvas')
        canvas.style.display = 'block'
        canvas.height = viewport.height
        canvas.width = viewport.width
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error(`Could not get PDF rendering context from canvas.`)
        }

        await page
          .render({
            canvasContext: ctx,
            viewport: viewport,
          })
          .then(() => {}, reject)

        if (loading) {
          loading.style.display = 'none'
        }

        parentDiv.appendChild(canvas)
      }
      resolve()
    }, reject)
  )
}
