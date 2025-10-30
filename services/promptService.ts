import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a creative assistant for an AI image generator. Your task is to take a user's simple prompt and expand it into a rich, detailed, and artistic prompt that will produce a high-quality, visually appealing image. 

Focus on adding details about:
- Subject: Add specific, descriptive adjectives.
- Setting/Background: Create a vivid environment.
- Style/Medium: Suggest an art style (e.g., photorealistic, watercolor, fantasy art, cinematic).
- Lighting: Describe the lighting (e.g., golden hour, dramatic lighting, soft light).
- Composition: Hint at the composition (e.g., close-up portrait, wide-angle shot).
- Emotion/Mood: Convey a feeling (e.g., serene, chaotic, mysterious).

Keep the prompt concise, under 100 words. Do not use markdown or formatting. Only return the enhanced prompt text.`;

export async function enhancePrompt(prompt: string, apiKey: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.8,
            },
        });
        const enhancedPrompt = response.text.trim().replace(/"/g, ''); // Remove quotes from response
        if (!enhancedPrompt) {
            throw new Error("Model returned an empty prompt.");
        }
        return enhancedPrompt;
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        throw new Error("Failed to enhance prompt. The original prompt will be used.");
    }
}
