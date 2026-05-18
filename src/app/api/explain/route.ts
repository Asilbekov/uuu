import { db } from '@/lib/db';
import { mistralChat } from '@/lib/mistral';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { questionIds } = body as { questionIds: string[] };

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'questionIds required' }, { status: 400 });
    }

    // Fetch questions that need explanations
    const questions = await db.question.findMany({
      where: {
        id: { in: questionIds },
        explanation: null,
      },
    });

    if (questions.length === 0) {
      // All questions already have explanations
      const allQuestions = await db.question.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, explanation: true },
      });
      return NextResponse.json({ explanations: allQuestions });
    }

    // Generate explanations using Mistral
    // Build prompt with all questions
    const questionsText = questions.map((q, i) => {
      const options = [`A) ${q.optionA}`, `B) ${q.optionB}`, `C) ${q.optionC}`, `D) ${q.optionD}`];
      if (q.optionE) options.push(`E) ${q.optionE}`);
      return `Q${i + 1}: ${q.text}\nOptions: ${options.join(', ')}\nCorrect: ${q.correctAnswer}`;
    }).join('\n\n');

    const explanationText = await mistralChat({
      messages: [
        {
          role: 'system',
          content: 'You are a concise tutor. For each question, provide a very brief one-line explanation of why the correct answer is right. Keep it to ONE short sentence max. For math: show the key calculation step. For science: state the key fact or formula. Format: Q1: <explanation>, Q2: <explanation>, etc. Use the same language as the question.',
        },
        {
          role: 'user',
          content: questionsText,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    // Parse explanations from LLM response
    const explanations: Record<string, string> = {};
    const lines = explanationText.split('\n').filter((l: string) => l.trim());

    for (const line of lines) {
      // Try to match patterns like "Q1: explanation" or "1: explanation" or "1) explanation"
      const match = line.match(/Q?(\d+)[:).]\s*(.+)/);
      if (match) {
        const qIdx = parseInt(match[1]) - 1;
        if (qIdx >= 0 && qIdx < questions.length) {
          explanations[questions[qIdx].id] = match[2].trim();
        }
      }
    }

    // Fallback: if parsing failed, assign line-by-line
    if (Object.keys(explanations).length === 0 && questions.length > 0) {
      for (let i = 0; i < Math.min(lines.length, questions.length); i++) {
        explanations[questions[i].id] = lines[i].replace(/^Q?\d+[:).]\s*/, '').trim();
      }
    }

    // Save generated explanations to DB
    const updatePromises = Object.entries(explanations).map(([id, explanation]) =>
      db.question.update({ where: { id }, data: { explanation } })
    );
    await Promise.all(updatePromises);

    // Return all explanations (including pre-existing ones)
    const allQuestions = await db.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, explanation: true },
    });

    return NextResponse.json({ explanations: allQuestions });
  } catch (error) {
    console.error('Generate explanations error:', error);
    return NextResponse.json({ error: 'Failed to generate explanations' }, { status: 500 });
  }
}
