import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure worker (place at top-level of component file)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(0);

  return (
    <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      {Array.from({ length: numPages }, (_, i) => (
        <Page key={`page_${i+1}`} pageNumber={i+1} />
      ))}
    </Document>
  );
};

export default PDFViewer;