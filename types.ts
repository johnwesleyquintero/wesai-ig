
export interface GeneratedImage {
  src: string;
}

// FIX: Export ModelType to be used in ModelSelector and the generate API.
export type ModelType = 'gemini-2.5-flash-image' | 'imagen-4.0-generate-001';

// FIX: Export AspectRatioType to be used in AspectRatioSelector and the generate API.
export type AspectRatioType = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
