import { prisma } from "@/database";

async function main() {
  const studentId = "student_123";

  console.log("Seeding database...");

  // Upsert user
  await prisma.user.upsert({
    where: { id: studentId },
    update: {},
    create: {
      id: studentId,
      name: "Rahul Yadav",
      email: "rahul.yadav@example.com",
    },
  });

  // Create performance analysis records if not present
  const existing = await prisma.performanceAnalysis.findFirst({
    where: { studentId },
  });

  if (!existing) {
    await prisma.performanceAnalysis.create({
      data: {
        studentId,
        totalQuestions: 15,
        attemptedQuestions: 15,
        correctAnswers: 12,
        scorePercentage: 82.5,
        accuracyPercentage: 80.0,
        grade: "A-",
        performanceLevel: "Strong",
        strengths: ["Excellent usage of React functional components", "Strong SQL database layout design"],
        weaknesses: ["Unfamiliarity with CI/CD deployment pipelines"],
        insights: ["Focusing on deployment pipeline exercises will bridge your primary fullstack skill gap."],
        topicMetrics: {
          create: [
            { topic: "React", correctAnswers: 7, attemptedQuestions: 10, percentage: 70.0, proficiency: "Good" },
            { topic: "Databases", correctAnswers: 6, attemptedQuestions: 11, percentage: 55.0, proficiency: "Average" },
            { topic: "DSA", correctAnswers: 6, attemptedQuestions: 10, percentage: 60.0, proficiency: "Average" },
            { topic: "System Design", correctAnswers: 4, attemptedQuestions: 10, percentage: 40.0, proficiency: "Needs Improvement" },
          ],
        },
      },
    });
    console.log("Seeded mock student performance data!");
  } else {
    console.log("Mock student performance data already exists.");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
