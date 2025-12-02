import type { PresetSize } from '../types';
import { PRESET_DIMENSIONS } from '../types';
import { sanitizeFilename } from './index';

/**
 * Export canvas to PNG file with optional preset sizing
 * @param canvas - The Fabric.js canvas instance
 * @param filename - The desired filename (will be sanitized)
 * @param presetSize - Optional preset size for social media platforms
 */
export const exportCanvasToPNG = async (
  canvas: any, // Fabric Canvas type
  filename: string,
  presetSize: PresetSize = null
): Promise<void> => {
  if (!canvas) {
    throw new Error('Canvas is not available');
  }

  // Sanitize the filename
  const sanitizedFilename = sanitizeFilename(filename);

  // Store original dimensions
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;
  const originalZoom = canvas.getZoom();

  try {
    // If a preset size is selected, scale the canvas
    if (presetSize && PRESET_DIMENSIONS[presetSize]) {
      const { width: targetWidth, height: targetHeight } = PRESET_DIMENSIONS[presetSize];
      
      // Calculate scale factors
      const scaleX = targetWidth / originalWidth;
      const scaleY = targetHeight / originalHeight;
      
      // Set new dimensions
      canvas.setDimensions({
        width: targetWidth,
        height: targetHeight,
      });
      
      // Scale all objects
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords();
      });
      
      // Scale background image if present
      if (canvas.backgroundImage) {
        canvas.backgroundImage.scaleX = (canvas.backgroundImage.scaleX || 1) * scaleX;
        canvas.backgroundImage.scaleY = (canvas.backgroundImage.scaleY || 1) * scaleY;
      }
      
      canvas.renderAll();
    }

    // Convert canvas to blob
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    // Convert data URL to blob
    const blob = await (await fetch(dataURL)).blob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedFilename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

  } finally {
    // Restore original dimensions if they were changed
    if (presetSize && PRESET_DIMENSIONS[presetSize]) {
      const { width: targetWidth, height: targetHeight } = PRESET_DIMENSIONS[presetSize];
      const scaleX = originalWidth / targetWidth;
      const scaleY = originalHeight / targetHeight;
      
      canvas.setDimensions({
        width: originalWidth,
        height: originalHeight,
      });
      
      // Restore object scales and positions
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords();
      });
      
      // Restore background image scale
      if (canvas.backgroundImage) {
        canvas.backgroundImage.scaleX = (canvas.backgroundImage.scaleX || 1) * scaleX;
        canvas.backgroundImage.scaleY = (canvas.backgroundImage.scaleY || 1) * scaleY;
      }
      
      canvas.setZoom(originalZoom);
      canvas.renderAll();
    }
  }
};
