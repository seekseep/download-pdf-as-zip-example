import JSZip from "jszip";

export async function zipFiles (files, type = 'blob') {
  const zip = new JSZip()

  files.forEach(({ name, data }) => zip.file(name, data))

  const content = await zip.generateAsync({ type })

  return content
}
