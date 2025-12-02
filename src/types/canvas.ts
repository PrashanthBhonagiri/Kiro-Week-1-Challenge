/**
 * Base interface for all canvas elements
 */
export interface CanvasElement {
  id: string;
  type: 'text' | 'line' | 'image';
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

/**
 * Text element with styling properties
 */
export interface TextElement extends CanvasElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;
}

/**
 * Line element with geometric properties
 */
export interface LineElement extends CanvasElement {
  type: 'line';
  length: number;
  thickness: number;
  color: string;
}

/**
 * Image element for logos and backgrounds
 */
export interface ImageElement extends CanvasElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
  isBackground: boolean;
}

/**
 * Preset sizes for social media platforms
 */
export type PresetSize = 
  | 'instagram-story'    // 1080x1920
  | 'instagram-post'     // 1080x1080
  | 'whatsapp'           // 1200x630
  | 'twitter'            // 1200x675
  | null;                // Original canvas size

/**
 * Dimension mappings for preset sizes
 */
export const PRESET_DIMENSIONS: Record<Exclude<PresetSize, null>, { width: number; height: number }> = {
  'instagram-story': { width: 1080, height: 1920 },
  'instagram-post': { width: 1080, height: 1080 },
  'whatsapp': { width: 1200, height: 630 },
  'twitter': { width: 1200, height: 675 },
};

/**
 * Action types for undo/redo history
 */
export interface Action {
  type: 'add' | 'update' | 'delete' | 'clear';
  elementId?: string;
  previousState?: CanvasElement;
  newState?: CanvasElement;
  previousElements?: CanvasElement[];
}

/**
 * Application state interface
 */
export interface AppState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  actionHistory: Action[];
  historyIndex: number;
  canvasBackground: string | null;
}
