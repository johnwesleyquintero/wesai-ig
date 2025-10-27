// This is a Vercel Serverless Function
// It can be triggered by a POST request to /api/generate

import { generateImage } from '../services/geminiService';

export const config = {
  runtime: 'edge', // Using the edge runtime for performance
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const imageUrls = await generateImage(prompt);

    return new Response(JSON.stringify({ imageUrls }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[API /generate] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    // Check for Gemini's specific rate limit error code within the message
    if (errorMessage.includes('"code":429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return new Response(JSON.stringify({ 
        error: "You've reached the free request limit. Please try again in a few minutes." 
      }), {
        status: 429, // Too Many Requests
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For all other errors, return a generic server error
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}