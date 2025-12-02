// Utility functions
// This file will contain helper functions for the application

import type { TextElement } from '../types';

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
