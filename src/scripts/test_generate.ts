// scripts/test-generate.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateAgentQuiz, Input } from '@/app/lib/aiUtils/generateQuiz';


async function main() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'pdf', 'JavaScript.pdf');
  // const pdfBuffer = fs.readFileSync(filePath); // Simulate uploaded PDF
  
  const input: Input = {
    pdfFile: filePath,
    prompt: "write me an email about gloabal warming",
    quiz_database_details: {
      title: 'JavaScript Basics Quiz',
      description: 'A comprehensive quiz about JavaScript basics',
      creator_id: '1',
      type: 'ai_generated',
      category: 'programming',
      difficulty: 'medium',
      visibility: 'public',
      status: 'draft',
      totalQuestions: 5,
      estimatedTime: 10,
      settings: {
        questionTypes: ['mcq', 'open_ended'],
        includeExplanations: true,
        includeMemory: true,
        language: 'en',
        customInstructions: 'Focus on basic JavaScript knowledge suitable for 2nd year students.',
      }
    },
  };

  try {
    console.log('Generating quiz...');
    console.log('Input:', JSON.stringify(input, null, 2));
    
    const result = await generateAgentQuiz(input);
    console.log('Success! Generated quiz:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error generating quiz:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

main();
