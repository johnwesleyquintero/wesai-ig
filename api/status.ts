// This is a Vercel Serverless Function
// It can be triggered by a GET request to /api/status

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ maskedKey: 'Not Set' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mask the API key for security, showing only the first 4 and last 4 characters
    const maskedKey = `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;

    return new Response(JSON.stringify({ maskedKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[API /status] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return new Response(JSON.stringify({ error: `Server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}