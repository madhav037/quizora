import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { createWorker } from 'tesseract.js';
import { NodeCanvasFactory } from '@/app/lib/aiUtils/nodeCanvasFactory'; // adjust path as needed

async function renderPdfPageToImage(pdfDoc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<Buffer> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 2.0 });

  const canvasFactory = new NodeCanvasFactory();
  const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvasFactory,
  };

  await page.render(renderContext).promise;
  return canvas.toBuffer('image/png');
}

// async function renderPdfPageToImage(pdfDoc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<Buffer> {
//   const page = await pdfDoc.getPage(pageNum);
//   const viewport = page.getViewport({ scale: 2.0 }); // Increase scale for better OCR quality
//   const canvas = createCanvas(viewport.width, viewport.height);
//   const context = canvas.getContext('2d');

//   const renderContext = {
//     canvasContext: context,
//     viewport: viewport,
//   };

//   await page.render(renderContext).promise;
//   return canvas.toBuffer('image/png');
// }

/**
 * Extracts text from a PDF, automatically handling image conversion via OCR.
 * @param filePath The path to the PDF file.
 * @returns A promise that resolves with the OCR-extracted text.
 */
export async function extractTextFromPDF(filePath: string): Promise<string | null> {
  const worker = await createWorker();
  
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdfDoc = await pdfjsLib.getDocument(data).promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    console.log(`PDF has ${numPages} page(s). Processing...`);

    // Initialize the Tesseract worker once
    await worker.load();
    await worker.reinitialize('eng');

    for (let i = 1; i <= numPages; i++) {
      console.log(`- Processing page ${i}`);
      // Step 1: Convert PDF page to an image buffer
      const imageBuffer = await renderPdfPageToImage(pdfDoc, i);
      
      // Step 2: Feed the image buffer to Tesseract for OCR
      const { data: { text } } = await worker.recognize(imageBuffer);
      fullText += text + '\n\n'; // Add page breaks
    }
    
    return fullText;
  } catch (error) {
    console.error('An error occurred during the PDF OCR process:', error);
    return null;
  } finally {
    // IMPORTANT: Shut down the worker to free up resources
    await worker.terminate();
    console.log('OCR process finished.');
  }
}


// --- How to use ---
// const pdfPath = path.join(__dirname, 'your-scanned-document.pdf'); // 👈 Make sure this path is correct

// (async () => {
//   const text = await ocrPdf(pdfPath);
//   if (text) {
//     console.log('--- FINAL EXTRACTED TEXT ---');
//     console.log(text);
//   }
// })();