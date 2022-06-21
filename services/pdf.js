import { jsPDF } from "jspdf";

function setUpDoc ({
  orientation = "landscape",
  format = "a4",
} = {}) {
  return new jsPDF({
      orientation,
      unit: "mm",
      format: format,
      compress: true
    }
  )
}

function setContentToDoc(doc, person) {
  const rate = Math.pow(2, 2)
  const width = 297 * rate
  const height = 210 * rate
  const fonSize = 5 * rate

  const canvas = document.createElement("canvas")
  document.body.appendChild(canvas)
  canvas.setAttribute("width", width)
  canvas.setAttribute("height", height)

  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "#FF0000"
  ctx.lineWidth = 1

  ctx.beginPath(width / 2, 0)
  ctx.lineTo(width / 2, 0)
  ctx.lineTo(width / 2, height)
  ctx.stroke()

  ctx.beginPath(0, height / 2)
  ctx.lineTo(0, height / 2)
  ctx.lineTo(width, height / 2)
  ctx.stroke()

  ctx.font = `${fonSize}px 'Noto Sans JP', sans-serif`
  ctx.fillStyle = "black"
  ctx.strokeStyle = ""
  ctx.fillText(`Name: ${person.name}`, 10, 20)

  doc.addImage(canvas, 'JPEG', 0, 0, width / rate, height / rate)

  // canvas.remove()
}

function docToPdfBlob (doc) {
  const blob = new Blob([
    doc.output('blob')
  ], {
    type: "application/pdf"
  })
  return blob
}

export function createPersonPdfFile (person) {
  const doc = setUpDoc()
  setContentToDoc(doc, person)
  return {
    name: `Person_${person.id} - ${person.name}.pdf`,
    data: docToPdfBlob(doc)
  }
}

export function createPeoplePdfFile (people) {
  const doc = setUpDoc()
  people.forEach((person, index) => {
    if (index > 0) {
      doc.addPage()
    }
    setContentToDoc(doc, person)
  })
  return {
    name: `People - (${people.length}).pdf`,
    data: docToPdfBlob(doc)
  }
}
