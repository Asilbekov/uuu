import { db } from '@/lib/db';
import { aiChat } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuestionContext {
  text: string;
  options: Record<string, string>;
  correctAnswer: string;
  topic: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // 2s, 5s, 10s

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

async function callAIWithRetry(conversationMessages: { role: 'system' | 'user' | 'assistant'; content: string }[], retries = MAX_RETRIES): Promise<string> {
  try {
    // Provider chain: Gemini → Google AI Mode → Mistral (see src/lib/ai.ts)
    const { text } = await aiChat({
      messages: conversationMessages,
      temperature: 0.5,
      max_tokens: 1600,
    });
    return text || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.message?.includes('Too many requests') || error?.message?.includes('rate');
    if (isRateLimit && retries > 0) {
      const delay = RETRY_DELAYS[MAX_RETRIES - retries];
      console.log(`Chat API rate limited, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callAIWithRetry(conversationMessages, retries - 1);
    }
    throw error;
  }
}

function sanitizeOptionValue(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, userAnswer, messages, questionContext } = body as {
      questionId: string;
      userAnswer?: string;
      messages: ChatMessage[];
      questionContext?: QuestionContext;
    };

    if (!questionId) {
      return NextResponse.json({ error: 'questionId required' }, { status: 400 });
    }

    // Fetch the question from DB (used as fallback when no context is provided)
    const dbQuestion = await db.question.findUnique({
      where: { id: questionId },
      include: { test: { select: { title: true, topic: true } } },
    });

    if (!dbQuestion && !questionContext) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // IMPORTANT: the client shuffles options before display, so the DB labels
    // may NOT match what the student sees. When the frontend provides
    // questionContext (the question exactly as displayed), always prefer it.
    const ctxText = sanitizeOptionValue(questionContext?.text);
    const ctxOptions = questionContext?.options && typeof questionContext.options === 'object'
      ? questionContext.options
      : null;
    const ctxCorrect = /^[A-E]$/.test((questionContext?.correctAnswer || '').trim())
      ? questionContext!.correctAnswer.trim()
      : null;

    const questionText = ctxText || dbQuestion?.text || 'Unknown question';

    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
    const options: string[] = [];
    if (ctxOptions) {
      for (const label of optionLabels) {
        const val = sanitizeOptionValue(ctxOptions[label]);
        if (val) options.push(`${label}) ${val}`);
      }
    }
    // Fallback to DB options when the context has fewer than 2 options
    if (options.length < 2 && dbQuestion) {
      options.length = 0;
      for (const label of optionLabels) {
        const val = dbQuestion[`option${label}` as keyof typeof dbQuestion] as string | null;
        if (val) options.push(`${label}) ${val}`);
      }
    }

    const correctAnswer = ctxCorrect || dbQuestion?.correctAnswer || 'A';
    const correctOptionText = ctxOptions
      ? sanitizeOptionValue(ctxOptions[correctAnswer])
      : (dbQuestion ? (dbQuestion[`option${correctAnswer}` as keyof typeof dbQuestion] as string | null) : null);
    const correctDisplay = correctOptionText ? `${correctAnswer}) ${correctOptionText}` : correctAnswer;

    const userOptionText = userAnswer
      ? (ctxOptions
          ? sanitizeOptionValue(ctxOptions[userAnswer]) || 'Unknown option'
          : (dbQuestion ? (dbQuestion[`option${userAnswer}` as keyof typeof dbQuestion] as string | null) || 'Unknown option' : 'Unknown option'))
      : null;

    const topic = questionContext?.topic || dbQuestion?.test?.topic || 'General';

    const isCorrect = userAnswer === correctAnswer;

    const LATEX_RULE = `FORMATTING RULES (STRICT):
1. Write ALL math, formulas, and equations using LaTeX wrapped in dollar signs: inline math like $x^2 + 1$, $\\frac{a}{b}$, $A^{-1}$, and display equations on their own line like $$\\int_0^1 x^2 dx = \\frac{1}{3}$$. NEVER write math as plain text (no "x^2", no "a/b" for fractions). Matrices use \\begin{pmatrix} ... \\end{pmatrix}.
2. NEVER use \\( ... \\) or \\[ ... \\] delimiters — only $...$ and $$...$$.
3. Do not use markdown headings (#). Use short bold labels like **Step 1:** when helpful. The interface renders LaTeX with KaTeX.`;

    let systemPrompt: string;

    if (userAnswer && !isCorrect) {
      // User answered incorrectly - explain why their answer is wrong AND why the correct one is right
      systemPrompt = `You are an expert AI tutor helping a student understand a test question. The student answered INCORRECTLY.

Question: ${questionText}
Options: ${options.join(' | ')}
Correct Answer: ${correctDisplay}
Student's Answer: ${userAnswer}) ${userOptionText}
Test Topic: ${topic}

ABSOLUTE RULE: The "Correct Answer" line above is GROUND TRUTH provided by the test system. It is ALWAYS correct — never question it, never suggest a different option is correct, and always refer to the correct answer by its letter (${correctAnswer}) and its text.

The student chose the WRONG answer. Explain:
1. Why the student's answer (${userAnswer}) is incorrect - what misconception or mistake led them there
2. Why the correct answer (${correctAnswer}) is the right choice - the key reasoning or fact

Be clear, educational, and supportive. Use the same language as the question. If it's a calculation, show the steps. If it's a concept, explain the underlying principle. Keep your initial response concise (2-3 sentences for each point), but be ready to elaborate if the student asks follow-up questions.

${LATEX_RULE}`;
    } else if (userAnswer && isCorrect) {
      // User answered correctly - explain why it's correct
      systemPrompt = `You are an expert AI tutor helping a student understand a test question. The student answered CORRECTLY.

Question: ${questionText}
Options: ${options.join(' | ')}
Correct Answer: ${correctDisplay}
Student's Answer: ${userAnswer}) ${userOptionText} (Correct!)
Test Topic: ${topic}

ABSOLUTE RULE: The "Correct Answer" line above is GROUND TRUTH provided by the test system. It is ALWAYS correct — never question it, never suggest a different option is correct, and always refer to the correct answer by its letter (${correctAnswer}) and its text.

The student chose the CORRECT answer. Confirm they are right and briefly explain WHY this answer is correct. Reinforce the key concept or principle. Keep it concise (1-2 sentences), but be ready to elaborate on follow-up questions.

${LATEX_RULE}`;
    } else {
      // No answer yet - just explain the question context
      systemPrompt = `You are an expert AI tutor. The student is looking at this test question:

Question: ${questionText}
Options: ${options.join(' | ')}
Test Topic: ${topic}

Help the student understand the concepts behind this question. Do NOT reveal the correct answer directly. Instead, guide them to think through it. Be educational and supportive.

${LATEX_RULE}`;
    }

    // Prepare the conversation for the LLM
    const conversationMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const aiResponse = await callAIWithRetry(conversationMessages);

    // Normalize \(...\) and \[...\] to $...$ / $$...$$ so the frontend renders them
    return NextResponse.json({ response: normalizeMathNotation(aiResponse) });
  } catch (error: any) {
    console.error('Chat API error:', error);
    const isRateLimit = error?.message?.includes('429') || error?.message?.includes('Too many requests') || error?.message?.includes('rate');
    if (isRateLimit) {
      return NextResponse.json({
        error: 'AI is currently busy. Please wait a moment and try again.',
        rateLimited: true,
      }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
