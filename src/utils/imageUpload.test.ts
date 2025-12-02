import { describe, it, expect } from 'vitest';
import { validateImageFile, createImageElement, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './index';

describe('Image Upload Utilities', () => {
  describe('validateImageFile', () => {
    it('should accept valid image files', () => {
      const validFile = new File([''], 'test.png', { type: 'image/png' });
      const result = validateImageFile(validFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files with invalid type', () => {
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should reject files exceeding size limit', () => {
      const largeFile = new File([new ArrayBuffer(MAX_FILE_SIZE + 1)], 'large.png', { type: 'image/png' });
      const result = validateImageFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size exceeds');
    });

    it('should accept all allowed image types', () => {
      ALLOWED_IMAGE_TYPES.forEach((type) => {
        const file = new File([''], 'test.img', { type });
        const result = validateImageFile(file);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('createImageElement', () => {
    it('should create an image element with correct properties', () => {
      const element = createImageElement('data:image/png;base64,test', 100, 100, 50, 50);
      
      expect(element.type).toBe('image');
      expect(element.src).toBe('data:image/png;base64,test');
      expect(element.x).toBe(50);
      expect(element.y).toBe(50);
      expect(element.rotation).toBe(0);
      expect(element.zIndex).toBe(0);
      expect(element.isBackground).toBe(false);
      expect(element.id).toBeDefined();
    });

    it('should scale down large images while maintaining aspect ratio', () => {
      const element = createImageElement('data:image/png;base64,test', 1000, 500);
      
      // Should scale down to max 200px on longest side
      expect(element.width).toBe(200);
      expect(element.height).toBe(100);
      // Aspect ratio should be maintained (2:1)
      expect(element.width / element.height).toBe(2);
    });

    it('should not scale up small images', () => {
      const element = createImageElement('data:image/png;base64,test', 50, 50);
      
      expect(element.width).toBe(50);
      expect(element.height).toBe(50);
    });

    it('should use default position when not provided', () => {
      const element = createImageElement('data:image/png;base64,test', 100, 100);
      
      expect(element.x).toBe(100);
      expect(element.y).toBe(100);
    });
  });
});
