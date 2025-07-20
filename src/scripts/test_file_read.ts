// Test PDF file reading
import fs from 'fs/promises';
import path from 'path';

async function testFileReading() {
  const pdfPath = "E:\\Codes\\Serious Projects\\Quizoraa\\client\\src\\data\\pdf\\JavaScript_Interview_questions.pdf";
  
  console.log("🧪 Testing file reading...");
  console.log("📁 File path:", pdfPath);
  
  try {
    // Test file existence
    const exists = await fs.access(pdfPath).then(() => true).catch(() => false);
    console.log("✅ File exists:", exists);
    
    if (exists) {
      // Read file stats
      const stats = await fs.stat(pdfPath);
      console.log("📊 File size:", stats.size, "bytes");
      console.log("📅 Modified:", stats.mtime);
      
      // Try reading the file
      const buffer = await fs.readFile(pdfPath);
      console.log("📄 Buffer size:", buffer.length);
      console.log("📄 First 20 bytes:", buffer.subarray(0, 20));
      
      // Check if it's a valid PDF
      const header = buffer.subarray(0, 5).toString();
      console.log("📄 File header:", header);
      
      if (header === '%PDF-') {
        console.log("✅ Valid PDF file detected");
        
        // Try to import pdf-parse and use it directly
        console.log("🔍 Testing pdf-parse directly...");
        const pdfParse = await import('pdf-parse');
        
        console.log("📦 pdf-parse imported successfully");
        console.log("📦 pdf-parse version/info:", Object.keys(pdfParse));
        
        const result = await pdfParse.default(buffer);
        console.log("✅ PDF parsed successfully!");
        console.log("📄 Text length:", result.text.length);
        console.log("📄 Number of pages:", result.numpages);
        console.log("📄 First 200 characters:", result.text.substring(0, 200));
        
      } else {
        console.log("❌ Not a valid PDF file");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testFileReading();
