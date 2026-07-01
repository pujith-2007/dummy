import "dotenv/config";
import { assessmentService } from "./src/features/assessment/services/assessment.service";
import { assessmentStore } from "./src/features/assessment/data/assessment.store";

async function runServiceTest() {
  try {
    console.log("=========================================");
    console.log("🛠️ TESTING ASSESSMENT SERVICE DIRECTLY");
    console.log("=========================================\n");

    // 1. Test starting an assessment
    console.log("👉 1. Calling assessmentService.startAssessment()...");
    const track = "Node.js Backend";
    const numQuestions = 2;
    const assessment = await assessmentService.startAssessment(track, numQuestions);
    
    console.log("\n✅ Assessment Created Successfully!");
    console.log(`ID: ${assessment.id}`);
    console.log(`Track: ${assessment.track}`);
    console.log(`Questions Generated: ${assessment.questions.length}\n`);

    // Log out the questions
    assessment.questions.forEach((q, i) => {
      console.log(`Q${i + 1}: ${q.question}`);
      q.options.forEach(opt => console.log(`   ${opt}`));
      console.log(`   (Internal Correct Answer: ${q.correctAnswer})`);
    });

    console.log("\n-----------------------------------------");

    // 2. Test checking the in-memory store
    console.log("\n👉 2. Verifying it was saved in the assessmentStore...");
    const saved = assessmentStore.findById(assessment.id);
    if (saved) {
        console.log("✅ Successfully retrieved from memory store!");
    }

    console.log("\n-----------------------------------------");

    // 3. Test submitting answers
    console.log("\n👉 3. Calling assessmentService.submitAssessment()...");
    
    // Let's pretend the user got the first one right, and the second one wrong
    const answers = [
        assessment.questions[0].correctAnswer, 
        "Z" // Intentionally wrong answer
    ];
    
    console.log(`Submitting Answers: [ ${answers.join(", ")} ]`);
    
    const result = assessmentService.submitAssessment(assessment.id, answers);
    
    console.log("\n✅ Scoring Service Result:");
    console.log(`Score: ${result.score}%`);
    console.log(`Correct Answers: ${result.correctAnswers} / ${result.totalQuestions}`);
    console.log(`Grade: ${result.grade}\n`);

  } catch (error) {
    console.error("\n❌ Error during service testing:");
    console.error(error);
  }
}

runServiceTest();
