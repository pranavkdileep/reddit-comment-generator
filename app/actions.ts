'use server';

import { GoogleGenAI } from '@google/genai';

type GenerateCommentInput = {
  title: string;
  body: string;
  image?: {
    mimeType: string;
    data: string;
  } | null;
};

type GenerateCommentResult = {
  comment?: string;
  error?: string;
};

export async function generateCommentAction(
  input: GenerateCommentInput
): Promise<GenerateCommentResult> {
  const { title, body, image } = input;

  if (!title && !body && !image) {
    return { error: 'Please provide at least a title, body, or image.' };
  }

  try {
    const apiKey =
      process.env.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { error: 'Gemini API key is not configured.' };
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are a Reddit user. Read the following post content and image (if provided).
      
      Post Title: ${title}
      Post Body: ${body}
      
      Task: Write a short, clear, human-sounding Reddit comment in response.
      
      Guidelines:
      - Keep it informal, practical, and easy to understand.
      - Avoid legal jargon, don't over-explain.
      - Sound like a real person giving advice or sharing an opinion.
      - Use Gen-Z slang occasionally if it fits, but don't overdo it.
      - Intentionally include very minor human errors (like a missing comma, lowercase start, or common abbreviation like "tho" or "rn") to make it look authentic.
      - Do NOT be overly helpful or robotic.
      - If the post is a question, answer it directly.
      - If it's a rant, empathize or offer a different perspective.
      - Keep it under 280 characters if possible, but can be longer if needed for a good answer.
    `;

    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [{ text: prompt }];

    if (image?.data) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.9,
      },
    });

    const comment = response.text?.trim();
    if (!comment) {
      return { error: 'No comment was generated. Please try again.' };
    }

    return { comment };
  } catch (error) {
    console.error('Error generating comment:', error);
    return { error: 'Failed to generate comment. Please try again.' };
  }
}
