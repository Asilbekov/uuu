import { PrismaClient } from '@prisma/client';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_0v7CLFZLp1GO@ep-green-haze-a16lqxjp-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

// Override the datasource URL at runtime so Prisma connects to Neon
const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL },
  },
});

async function main() {
  console.log('=== DB Data Quality Fix Script ===\n');

  // ── Step 1: Remove "(Correct one)" hints from option fields ──
  console.log('--- Step 1: Removing "(Correct one)" hints from option text ---');
  const optionFields = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'];
  let totalUpdated = 0;

  // Fetch all questions that contain "(Correct one)" in any option field
  const questionsWithHint = await prisma.question.findMany({
    where: {
      OR: optionFields.map((field) => ({
        [field]: { contains: '(Correct one)', mode: 'insensitive' },
      })),
    },
  });

  console.log(
    `Found ${questionsWithHint.length} questions with "(Correct one)" in option text.`
  );

  for (const q of questionsWithHint) {
    const updates = {};
    for (const field of optionFields) {
      const val = q[field];
      if (val && val.includes('(Correct one)')) {
        updates[field] = val.replace(/\(Correct one\)/gi, '').trimEnd();
      }
    }
    if (Object.keys(updates).length > 0) {
      await prisma.question.update({
        where: { id: q.id },
        data: updates,
      });
      totalUpdated++;
      console.log(`  Updated question ${q.id}: ${JSON.stringify(updates)}`);
    }
  }

  console.log(`\nTotal records updated (hints removed): ${totalUpdated}\n`);

  // ── Step 2: Find duplicate questions with different correctAnswer ──
  console.log(
    '--- Step 2: Duplicate questions with inconsistent correctAnswer ---'
  );
  const allQuestions = await prisma.question.findMany({
    select: { id: true, text: true, correctAnswer: true, testId: true },
  });

  const textGroups = {};
  for (const q of allQuestions) {
    if (!textGroups[q.text]) {
      textGroups[q.text] = [];
    }
    textGroups[q.text].push(q);
  }

  const inconsistentGroups = [];
  for (const [text, group] of Object.entries(textGroups)) {
    if (group.length < 2) continue;
    const answers = new Set(group.map((q) => q.correctAnswer));
    if (answers.size > 1) {
      inconsistentGroups.push({
        text,
        questions: group,
        distinctAnswers: [...answers],
      });
    }
  }

  if (inconsistentGroups.length === 0) {
    console.log(
      'No duplicate questions with inconsistent correctAnswer found.'
    );
  } else {
    console.log(
      `Found ${inconsistentGroups.length} question text(s) with inconsistent correctAnswer:\n`
    );
    for (const g of inconsistentGroups) {
      console.log(
        `  Question text: "${g.text.substring(0, 100)}${g.text.length > 100 ? '...' : ''}"`
      );
      console.log(`  Distinct answers: ${g.distinctAnswers.join(', ')}`);
      for (const q of g.questions) {
        console.log(
          `    - ID: ${q.id}, correctAnswer: ${q.correctAnswer}, testId: ${q.testId}`
        );
      }
      console.log();
    }
  }

  // ── Step 3: Find questions where optionE is null but correctAnswer is "E" ──
  console.log(
    '--- Step 3: Questions where optionE is null but correctAnswer is "E" ---'
  );
  const badEQuestions = await prisma.question.findMany({
    where: {
      correctAnswer: 'E',
      optionE: null,
    },
  });

  if (badEQuestions.length === 0) {
    console.log(
      'No questions with correctAnswer="E" and null optionE found.'
    );
  } else {
    console.log(
      `Found ${badEQuestions.length} question(s) with correctAnswer="E" but optionE is null:`
    );
    for (const q of badEQuestions) {
      console.log(
        `  - ID: ${q.id}, text: "${q.text.substring(0, 80)}..."`
      );
    }
  }
  console.log();

  // ── Step 4: Find questions where the correctAnswer option text is null ──
  console.log(
    '--- Step 4: Questions where correctAnswer points to a null option ---'
  );
  const allQs = await prisma.question.findMany({
    select: {
      id: true,
      text: true,
      correctAnswer: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      optionE: true,
    },
  });

  const answerToField = {
    A: 'optionA',
    B: 'optionB',
    C: 'optionC',
    D: 'optionD',
    E: 'optionE',
  };
  const nullOptionQuestions = [];

  for (const q of allQs) {
    const field = answerToField[q.correctAnswer];
    if (!field) {
      // correctAnswer is not A-E
      nullOptionQuestions.push({
        id: q.id,
        text: q.text,
        correctAnswer: q.correctAnswer,
        reason: `correctAnswer "${q.correctAnswer}" is not a valid option (A-E)`,
      });
      continue;
    }
    if (q[field] === null || q[field] === undefined || q[field] === '') {
      nullOptionQuestions.push({
        id: q.id,
        text: q.text,
        correctAnswer: q.correctAnswer,
        reason: `correctAnswer="${q.correctAnswer}" but ${field} is null/empty`,
      });
    }
  }

  if (nullOptionQuestions.length === 0) {
    console.log(
      'No questions with correctAnswer pointing to a null option found.'
    );
  } else {
    console.log(
      `Found ${nullOptionQuestions.length} question(s) where correctAnswer points to a null/empty option:`
    );
    for (const q of nullOptionQuestions) {
      console.log(
        `  - ID: ${q.id}, correctAnswer: ${q.correctAnswer}, reason: ${q.reason}`
      );
      console.log(`    text: "${q.text.substring(0, 80)}..."`);
    }
  }

  // ── Summary ──
  console.log('\n========== SUMMARY ==========');
  console.log(`Records updated (hints removed):                  ${totalUpdated}`);
  console.log(`Duplicate questions with inconsistent answers:   ${inconsistentGroups.length}`);
  console.log(`Questions with correctAnswer="E" & null optionE: ${badEQuestions.length}`);
  console.log(`Questions with correctAnswer pointing to null:   ${nullOptionQuestions.length}`);
  console.log('==============================\n');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
