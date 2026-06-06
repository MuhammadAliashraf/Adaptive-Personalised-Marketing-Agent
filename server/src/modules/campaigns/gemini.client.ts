import { GoogleGenAI, type Schema } from '@google/genai';
import { env } from '@config/env';

/**
 * Thin wrapper around the Google Gemini SDK. The rest of the app talks to Gemini
 * only through {@link generateJson}; callers are expected to catch errors and
 * fall back to deterministic logic so a demo never hard-fails on the network.
 */

let client: GoogleGenAI | null = null;

/** True when a Gemini API key is configured. */
export const geminiEnabled = (): boolean => Boolean(env.GEMINI_API_KEY);

/** Lazily constructs (and caches) the SDK client. */
function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return client;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini request timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export interface GenerateJsonArgs {
  /** System instruction binding the model to guardrails + the JSON contract. */
  system: string;
  /** The user/task prompt. */
  prompt: string;
  /** Structured-output schema enforced by Gemini (responseSchema). */
  schema: Schema;
}

/**
 * Calls Gemini with native structured output and returns the parsed JSON.
 * Throws on timeout, empty response, or unparseable output — callers fall back.
 */
export async function generateJson<T>({ system, prompt, schema }: GenerateJsonArgs): Promise<T> {
  const ai = getClient();

  const response = await withTimeout(
    ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.9,
      },
    }),
    env.GEMINI_TIMEOUT_MS,
  );

  const text = response.text?.trim();
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(text) as T;
}
