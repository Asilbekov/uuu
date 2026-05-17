const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
    }
  }
});

async function main() {
  // Load the question data
  const test1Data = JSON.parse(fs.readFileSync('/home/z/my-project/upload/new_batch_results/test1_physics_100q.json', 'utf-8'));
  const test2Data = JSON.parse(fs.readFileSync('/home/z/my-project/upload/new_batch_results/test2_physics_45q.json', 'utf-8'));

  console.log(`Loaded Test 1: ${test1Data.length} questions`);
  console.log(`Loaded Test 2: ${test2Data.length} questions`);

  // Find or create the demo user
  let user = await prisma.user.findUnique({ where: { email: 'demo@chemtest.com' } });
  if (!user) {
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update('demo123').digest('hex');
    user = await prisma.user.create({
      data: {
        email: 'demo@chemtest.com',
        name: 'Demo User',
        password: hashedPassword,
      },
    });
  }
  console.log(`Using user: ${user.email} (${user.id})`);

  // Check if physics tests already exist and delete them
  const existingTests = await prisma.test.findMany({
    where: {
      title: { in: ['Physics: Complete Test 1', 'Physics: Complete Test 2'] },
      creatorId: user.id,
    },
  });

  for (const test of existingTests) {
    console.log(`Deleting existing test: ${test.title}`);
    await prisma.attemptAnswer.deleteMany({
      where: { attempt: { testId: test.id } },
    });
    await prisma.testAttempt.deleteMany({
      where: { testId: test.id },
    });
    await prisma.test.delete({ where: { id: test.id } });
  }

  // Create Physics Test 1 (100 questions)
  console.log('\nCreating Physics: Complete Test 1...');
  const test1 = await prisma.test.create({
    data: {
      title: 'Physics: Complete Test 1',
      description: 'Complete physics test with 100 questions covering mechanics, gravitation, oscillations, thermodynamics, and more. Topics include Newton\'s laws, gravitational fields, pendulums, work and energy, ideal gas laws, and thermodynamic processes.',
      topic: 'Physics',
      creatorId: user.id,
      isPublic: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      questions: {
        create: test1Data.map((q, index) => ({
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
  console.log(`Created test: ${test1.title} with ${test1Data.length} questions`);

  // Create Physics Test 2 (45 questions)
  console.log('\nCreating Physics: Complete Test 2...');
  const test2 = await prisma.test.create({
    data: {
      title: 'Physics: Complete Test 2',
      description: 'Complete physics test with 45 questions covering potential energy, forces, conservative fields, orbital mechanics, oscillations, and dynamics. Topics include force fields, energy conservation, planetary motion, and differential equations of motion.',
      topic: 'Physics',
      creatorId: user.id,
      isPublic: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      questions: {
        create: test2Data.map((q, index) => ({
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
  console.log(`Created test: ${test2.title} with ${test2Data.length} questions`);

  // Verify
  const allTests = await prisma.test.findMany({
    include: { _count: { select: { questions: true } } },
    where: { creatorId: user.id },
  });
  console.log('\n=== All Tests ===');
  allTests.forEach(t => {
    console.log(`  - ${t.title} (${t._count.questions} questions)`);
  });

  await prisma.$disconnect();
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
