import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadPdfFiles (zipFileName, pdfFiles) {
  const zip = new JSZip()

  pdfFiles.forEach(({ name, data }) => zip.file(name, data))

  const content = await zip.generateAsync({
    type: "blob"
  })

  saveAs(content, zipFileName)
}
