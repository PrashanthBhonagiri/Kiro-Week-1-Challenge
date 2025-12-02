// Utility functions
// This file will contain helper functions for the application

import type { TextElement, ImageElement } from '../types';

/**
 * Common fonts available for text elements
 */
export const COMMON_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Palatino',
  'Garamond',
  'Bookman',
  'Tahoma',
  'Century Gothic',
  'Lucida Sans',
];

/**
 * Maximum file size for image uploads (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed image file types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
];

/**
 * Generate a unique ID for canvas elements
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new text element with default properties
 * @param x - X position on canvas (default: 100)
 * @param y - Y position on canvas (default: 100)
 * @returns A new TextElement with default styling
 */
export const createTextElement = (x: number = 100, y: number = 100): TextElement => {
  return {
    id: generateId(),
    type: 'text',
    x,
    y,
    rotation: 0,
    zIndex: 0,
    content: 'Double click to edit',
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#000000',
    width: 200,
    height: 50,
  };
};

/**
 * Validate an uploaded image file
 * @param file - The file to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Load an image file and get its dimensions
 * @param file - The image file to load
 * @returns Promise with image data URL and dimensions
 */
export const loadImageFile = (file: File): Promise<{ src: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        resolve({
          src,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = src;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Create a new image element (logo) with default properties
 * @param src - Image data URL
 * @param width - Original image width
 * @param height - Original image height
 * @param x - X position on canvas (default: 100)
 * @param y - Y position on canvas (default: 100)
 * @returns A new ImageElement for a logo
 */
export const createImageElement = (
  src: string,
  width: number,
  height: number,
  x: number = 100,
  y: number = 100
): ImageElement => {
  // Scale down large images to a reasonable size while maintaining aspect ratio
  const maxDimension = 200;
  let scaledWidth = width;
  let scaledHeight = height;

  if (width > maxDimension || height > maxDimension) {
    const scale = Math.min(maxDimension / width, maxDimension / height);
    scaledWidth = width * scale;
    scaledHeight = height * scale;
  }

  return {
    id: generateId(),
    type: 'image',
    x,
    y,
    rotation: 0,
    zIndex: 0,
    src,
    width: scaledWidth,
    height: scaledHeight,
    isBackground: false,
  };
};
