import { ExplainAnswerInput, explainAnswer } from "@/lib/aiUtils/explainAnswers";

async function main(params: ExplainAnswerInput) {
    const result = await explainAnswer(params);
    console.log(result);
}

main({
  user_id: 1,
  quiz_id: 13,
  answers: [
    { question_id: 16, user_answer: ['8'] },
    { question_id: 18, user_answer: ['iNDIAN'] }
  ]
}).catch(error => {
  console.error('Error explaining answers:', error);
});