import { jsPDF } from "jspdf";

export function createPersonPdfFile (person) {
  const doc = new jsPDF()

  doc.text(`Name: ${person.name}`, 10, 10, { maxWidth: 100 });
  doc.text(`Age: ${person.age}`, 10, 20, { maxWidth: 100  });
  doc.text(`Bio: ${person.bio}`, 10, 30, { maxWidth: 100 });

  const blob = new Blob([
    doc.output('blob')
  ], {
    type: "application/pdf"
  })

  return {
    name: `Person - ${person.name}.pdf`,
    data: blob
  }
}
