import { useState, useCallback, useEffect } from 'react';

const useMockup = (imageSrc: string | null) => {
  const [mockupSrc, setMockupSrc] = useState<string | null>(null);
  const [isCreatingMockup, setIsCreatingMockup] = useState<boolean>(false);

  // When a new image is generated (source changes), clear the old mockup
  useEffect(() => {
    setMockupSrc(null);
  }, [imageSrc]);

  const createMockup = useCallback(async () => {
    if (!imageSrc) return;
    setIsCreatingMockup(true);

    try {
      const mockupDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for canvas with data URLs
        img.src = imageSrc;

        img.onload = () => {
          const A_PLUS_WIDTH = 970;
          const PADDING = 20;

          const scale = A_PLUS_WIDTH / img.width;
          const imgHeight = img.height * scale;

          const canvas = document.createElement('canvas');
          canvas.width = A_PLUS_WIDTH + PADDING * 2;
          canvas.height = imgHeight + PADDING * 2;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }

          // White background for the mockup page
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the generated image onto the canvas
          ctx.drawImage(img, PADDING, PADDING, A_PLUS_WIDTH, imgHeight);

          // Convert canvas to a high-quality JPEG
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        
        img.onerror = (err) => {
          reject(new Error('Failed to load image for mockup creation.'));
          console.error(err);
        };
      });
      setMockupSrc(mockupDataUrl);
    } catch (err) {
      console.error('Error creating mockup:', err);
      // We can add an error state for mockup creation if needed
    } finally {
      setIsCreatingMockup(false);
    }
  }, [imageSrc]);

  return { mockupSrc, isCreatingMockup, createMockup };
};

export default useMockup;