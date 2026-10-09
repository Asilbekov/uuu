// Mistral AI API client
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'mstrl_naalPY3i3Et7CiwdCYCPFJhONOFzt0qI_13UuG1';
const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
  responseFormat?: 'json_object' | 'text';
}

export async function mistralChat(options: ChatCompletionOptions): Promise<string> {
  const {
    messages,
    temperature = 0.5,
    max_tokens = 800,
    model = process.env.MISTRAL_MODEL || 'mistral-small-latest',
    responseFormat,
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
      ...(responseFormat === 'json_object' ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Run Mistral OCR on a PDF document.
 * @param documentUrl - public https URL or a `data:application/pdf;base64,...` URI
 * @returns markdown text per page, joined by page breaks. Math is returned as LaTeX.
 */
export async function mistralOcr(documentUrl: string, pages?: number[]): Promise<string> {
  const response = await fetch(`${MISTRAL_BASE_URL}/ocr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-ocr-latest',
      document: { type: 'document_url', document_url: documentUrl },
      include_image_base64: false,
      ...(pages && pages.length ? { pages } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Mistral OCR error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const pageContents: string[] = (data.pages || []).map((p: { markdown?: string }) => p.markdown || '');
  return pageContents.join('\n\n---\n\n');
}
