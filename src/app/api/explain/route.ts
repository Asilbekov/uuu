import { db } from '@/lib/db';
import { aiChat } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { isLang, LANG_FULL, Lang } from '@/lib/i18n';

/**
 * Normalize math delimiters coming from the LLM.
 * Many models emit \( ... \) and \[ ... \] while the frontend renders $...$ / $$...$$.
 */
function normalizeMathNotation(text: string): string {
  if (!text) return text;
  // Protect LaTeX row separators "\\" (pmatrix rows) BEFORE delimiter
  // conversion, so "\\(" (rowsep + paren) is not mistaken for "\( ".
  const ROWSEP = '\u0002';
  let out = text.replace(/\\\\/g, ROWSEP);
  out = out
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `$$${inner}$$`);
  return out.split(ROWSEP).join('\\\\');
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { questionIds } = body as { questionIds: string[] };
    // Optional UI language: freshly generated explanations are written in this
    // language (stored in translations[lang].explanation for non-English).
    const lang: Lang = isLang(body.lang) ? body.lang : 'en';

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
      const optionLabels = ['A', 'B', 'C', 'D', 'E'];
      const options: string[] = [];
      for (const label of optionLabels) {
        const val = q[`option${label}` as keyof typeof q] as string | null;
        if (val) options.push(`${label}) ${val}`);
      }
      const correctOptionText = q[`option${q.correctAnswer}` as keyof typeof q] as string | null;
      return `Q${i + 1}: ${q.text}\nOptions: ${options.join(', ')}\nCorrect: ${q.correctAnswer}) ${correctOptionText || 'Unknown'}`;
    }).join('\n\n');

    const explanationText = await aiChat({
      messages: [
        {
          role: 'system',
          content: 'You are a concise tutor. For each question, provide a very brief one-line explanation of why the correct answer is right. Keep it to ONE short sentence max. For math: show the key calculation step. For science: state the key fact or formula. Format: Q1: <explanation>, Q2: <explanation>, etc.' + (lang === 'en' ? ' Use the same language as the question.' : ` Write EVERY explanation in ${LANG_FULL[lang]} — no exceptions.`) + ' FORMATTING RULES: write all math/formulas in LaTeX wrapped in single dollar signs like $x^2$, $\\frac{a}{b}$, $A^{-1}$ — the interface renders LaTeX, never use plain-text notation like x^2. NEVER use \\( \\) or \\[ \\] delimiters — only $...$.',
        },
        {
          role: 'user',
          content: questionsText,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    }).then(r => r.text);

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

    // Save generated explanations to DB. English goes to the classic column;
    // other languages additionally land in translations[lang].explanation so
    // the language switcher can pick them up later.
    if (lang === 'en') {
      const updatePromises = Object.entries(explanations).map(([id, explanation]) =>
        db.question.update({ where: { id }, data: { explanation: normalizeMathNotation(explanation) } })
      );
      await Promise.all(updatePromises);
    } else {
      const updatePromises = Object.entries(explanations).map(async ([id, explanation]) => {
        const norm = normalizeMathNotation(explanation);
        const row = await db.question.findUnique({ where: { id }, select: { translations: true } });
        const tr = (row?.translations as Record<string, any> | null) || {};
        tr[lang] = { ...(tr[lang] || {}), explanation: norm };
        return db.question.update({ where: { id }, data: { translations: tr } });
      });
      await Promise.all(updatePromises);
    }

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
