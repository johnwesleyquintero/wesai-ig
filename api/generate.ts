import { GoogleGenAI, Modality } from "@google/genai";
import type { ModelType } from "../types";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt, model, aspectRatio } = await req.json();

    if (!prompt || !model) {
      return new Response(JSON.stringify({ message: 'Missing required parameters: prompt and model' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // FIX: Use GoogleGenAI with API key from environment variables.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const imageUrls: string[] = [];
  
    if (model === 'imagen-4.0-generate-001') {
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio || '1:1',
          },
      });
  
      if (response.generatedImages && response.generatedImages.length > 0) {
        for (const generatedImage of response.generatedImages) {
          const base64ImageBytes: string = generatedImage.image.imageBytes;
          const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
          imageUrls.push(imageUrl);
        }
      }
    } else if (model === 'gemini-2.5-flash-image') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            imageUrls.push(imageUrl);
          }
        }
      }
    } else {
        return new Response(JSON.stringify({ message: 'Invalid model specified' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (imageUrls.length === 0) {
      return new Response(JSON.stringify({ message: 'API returned no images. The prompt may have been blocked.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ imageUrls: imageUrls }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/generate:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
    
    return new Response(JSON.stringify({ message: errorMessage, error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
