
export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
}

export type GenerationModel = 'gemini' | 'huggingface';
