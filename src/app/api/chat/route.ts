import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, userAnswer, messages } = body as {
      questionId: string;
      userAnswer?: string;
      messages: ChatMessage[];
    };

    if (!questionId) {
      return NextResponse.json({ error: 'questionId required' }, { status: 400 });
    }

    // Fetch the full question with all options
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: { test: { select: { title: true, topic: true } } },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Build the question context for the AI
    const options: string[] = [];
    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
    for (const label of optionLabels) {
      const val = question[`option${label}` as keyof typeof question] as string | null;
      if (val) options.push(`${label}) ${val}`);
    }

    const isCorrect = userAnswer === question.correctAnswer;
    const userOptionText = userAnswer ? question[`option${userAnswer}` as keyof typeof question] as string : 'No answer';

    let systemPrompt: string;

    if (userAnswer && !isCorrect) {
      // User answered incorrectly - explain why their answer is wrong AND why the correct one is right
      systemPrompt = `You are an expert AI tutor helping a student understand a test question. The student answered INCORRECTLY.

Question: ${question.text}
Options: ${options.join(', ')}
Correct Answer: ${question.correctAnswer}) ${question[`option${question.correctAnswer}` as keyof typeof question]}
Student's Answer: ${userAnswer}) ${userOptionText}
Test Topic: ${question.test?.topic || 'General'}

The student chose the WRONG answer. Explain:
1. Why the student's answer (${userAnswer}) is incorrect - what misconception or mistake led them there
2. Why the correct answer (${question.correctAnswer}) is the right choice - the key reasoning or fact

Be clear, educational, and supportive. Use the same language as the question. If it's a calculation, show the steps. If it's a concept, explain the underlying principle. Keep your initial response concise (2-3 sentences for each point), but be ready to elaborate if the student asks follow-up questions.`;
    } else if (userAnswer && isCorrect) {
      // User answered correctly - explain why it's correct
      systemPrompt = `You are an expert AI tutor helping a student understand a test question. The student answered CORRECTLY.

Question: ${question.text}
Options: ${options.join(', ')}
Correct Answer: ${question.correctAnswer}) ${question[`option${question.correctAnswer}` as keyof typeof question]}
Student's Answer: ${userAnswer}) ${userOptionText} (Correct!)
Test Topic: ${question.test?.topic || 'General'}

The student chose the CORRECT answer. Confirm they are right and briefly explain WHY this answer is correct. Reinforce the key concept or principle. Keep it concise (1-2 sentences), but be ready to elaborate on follow-up questions.`;
    } else {
      // No answer yet - just explain the question context
      systemPrompt = `You are an expert AI tutor. The student is looking at this test question:

Question: ${question.text}
Options: ${options.join(', ')}
Test Topic: ${question.test?.topic || 'General'}

Help the student understand the concepts behind this question. Do NOT reveal the correct answer directly. Instead, guide them to think through it. Be educational and supportive.`;
    }

    // Prepare the conversation for the LLM
    const conversationMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: conversationMessages,
      temperature: 0.5,
      max_tokens: 800,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
