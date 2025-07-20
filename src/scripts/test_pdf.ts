// // Test PDF extraction
// import 'dotenv/config';
// import { extractTextFromPDF } from '@/lib/aiUtils/pdfUtils';
// import path from 'path';

// async function testPDFExtraction() {
//   const pdfPath = "E:\\Codes\\Serious Projects\\Quizoraa\\client\\src\\data\\pdf\\JavaScript_Interview_questions.pdf";
  
//   console.log("🧪 Testing PDF extraction...");
//   console.log("📁 File path:", pdfPath);
//   console.log("📁 Resolved path:", path.resolve(pdfPath));
  
//   try {
//     const text = await extractTextFromPDF(pdfPath);
//     console.log("✅ Extraction successful!");
//     console.log("📄 Text length:", text.length);
//     console.log("📄 First 200 characters:", text.substring(0, 200));
    
//     if (text.length > 0) {
//       console.log("🎉 PDF extraction working correctly!");
//     } else {
//       console.log("⚠️ PDF extraction returned empty text");
//     }
//   } catch (error) {
//     console.error("❌ PDF extraction failed:", error);
//   }
// }

// testPDFExtraction();
