const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
    }
  }
});

async function main() {
  // Load both test question files
  const test1Data = JSON.parse(fs.readFileSync('/home/z/my-project/upload/new_batch_results/test1_physics_100q.json', 'utf-8'));
  const test2Data = JSON.parse(fs.readFileSync('/home/z/my-project/upload/new_batch_results/test2_physics_45q.json', 'utf-8'));

  // Combine all questions: test1 first, then test2
  const allQuestions = [...test1Data, ...test2Data];
  console.log(`Combined: ${allQuestions.length} questions (${test1Data.length} + ${test2Data.length})`);

  const user = await prisma.user.findUnique({ where: { email: 'demo@chemtest.com' } });

  // Delete existing physics tests
  const existingPhysics = await prisma.test.findMany({
    where: {
      title: { in: ['Physics: Complete Test 1', 'Physics: Complete Test 2', 'Physics: Complete Test'] },
      creatorId: user.id,
    },
  });

  for (const test of existingPhysics) {
    console.log(`Deleting: ${test.title}`);
    await prisma.attemptAnswer.deleteMany({ where: { attempt: { testId: test.id } } });
    await prisma.testAttempt.deleteMany({ where: { testId: test.id } });
    await prisma.test.delete({ where: { id: test.id } });
  }

  // Create one combined physics test
  console.log('\nCreating Physics: Complete Test...');
  const test = await prisma.test.create({
    data: {
      title: 'Physics: Complete Test',
      description: `Complete physics test with ${allQuestions.length} questions covering mechanics, gravitation, oscillations, thermodynamics, potential energy, conservative fields, orbital mechanics, and dynamics. Choose how many questions you want to answer!`,
      topic: 'Physics',
      creatorId: user.id,
      isPublic: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      questions: {
        create: allQuestions.map((q, index) => ({
          text: q.question,
          optionA: q.options.A || '',
          optionB: q.options.B || '',
          optionC: q.options.C || '',
          optionD: q.options.D || '',
          optionE: q.options.E || null,
          correctAnswer: q.correct || 'A',
          imageNumber: q.image_number,
          orderNum: index,
        })),
      },
    },
  });
  console.log(`Created: ${test.title} with ${allQuestions.length} questions`);

  // Verify all tests
  const allTests = await prisma.test.findMany({
    include: { _count: { select: { questions: true } } },
    where: { creatorId: user.id },
  });
  console.log('\n=== All Tests ===');
  allTests.forEach(t => console.log(`  - ${t.title} (${t._count.questions} questions)`));

  await prisma.$disconnect();
  console.log('\nDone!');
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
