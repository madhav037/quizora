import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { createWorker } from 'tesseract.js';
import { NodeCanvasFactory } from '@/app/lib/aiUtils/nodeCanvasFactory';

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

async function extractTextFromPDF(fileBuffer: Buffer): Promise<string | null> {
  const worker = await createWorker();
  
  try {
    const data = new Uint8Array(fileBuffer);
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractTextFromPDF(fileBuffer);
    
    if (!extractedText) {
      return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
