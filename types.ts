
export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
}

export type GenerationModel = 'gemini' | 'huggingface';

export type AspectRatio = '1:1' | '3:4' | '16:9';
