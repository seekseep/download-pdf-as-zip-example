import { jsPDF } from "jspdf";

function setContentToDoc(doc, person) {
  doc.text(`Name: ${person.name}`, 10, 10, { maxWidth: 100 });
  doc.text(`Age: ${person.age}`, 10, 20, { maxWidth: 100  });
  doc.text(`Bio: ${person.bio}`, 10, 30, { maxWidth: 100 });
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
  const doc = new jsPDF()

  setContentToDoc(doc, person)

  return {
    name: `Person - ${person.name}.pdf`,
    data: docToPdfBlob(doc)
  }
}


export function createPeoplePdfFile (people) {
  const doc = new jsPDF()

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
