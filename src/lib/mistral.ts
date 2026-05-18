// Mistral AI API client - replaces z-ai-web-dev-sdk
const MISTRAL_API_KEY = '8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl';
const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

export async function mistralChat(options: ChatCompletionOptions): Promise<string> {
  const {
    messages,
    temperature = 0.5,
    max_tokens = 800,
    model = 'mistral-small-latest',
  } = options;

  const response = await fetch(`${MISTRAL_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
