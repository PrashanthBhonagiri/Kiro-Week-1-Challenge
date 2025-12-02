import { create } from 'zustand';
import type { CanvasElement, Action } from '../types/canvas';

/**
 * Application state interface
 */
interface AppState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  actionHistory: Action[];
  historyIndex: number;
  canvasBackground: string | null;
}

/**
 * Store actions interface
 */
interface StoreActions {
  // Element management
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement> & Record<string, any>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  
  // Canvas management
  clearCanvas: () => void;
  setCanvasBackground: (background: string | null) => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  
  // Selectors
  canUndo: () => boolean;
  canRedo: () => boolean;
}

type Store = AppState & StoreActions;

/**
 * Helper function to record an action in history
 */
const recordAction = (
  state: AppState,
  action: Action
): Pick<AppState, 'actionHistory' | 'historyIndex'> => {
  // Remove any actions after the current history index (when undoing then performing new action)
  const newHistory = state.actionHistory.slice(0, state.historyIndex + 1);
  
  return {
    actionHistory: [...newHistory, action],
    historyIndex: newHistory.length,
  };
};

/**
 * Main Zustand store for poster generator application
 */
export const useStore = create<Store>((set, get) => ({
  // Initial state
  elements: [],
  selectedElementId: null,
  actionHistory: [],
  historyIndex: -1,
  canvasBackground: null,

  // Add a new element to the canvas
  addElement: (element: CanvasElement) => {
    set((state) => {
      const action: Action = {
        type: 'add',
        elementId: element.id,
        newState: element,
      };
      
      const historyUpdate = recordAction(state, action);
      
      return {
        elements: [...state.elements, element],
        ...historyUpdate,
      };
    });
  },

  // Update an existing element
  updateElement: (id: string, updates: Partial<CanvasElement>) => {
    set((state) => {
      const elementIndex = state.elements.findIndex((el) => el.id === id);
      
      if (elementIndex === -1) return state;
      
      const previousState = state.elements[elementIndex];
      const newState = { ...previousState, ...updates };
      
      const action: Action = {
        type: 'update',
        elementId: id,
        previousState,
        newState,
      };
      
      const historyUpdate = recordAction(state, action);
      
      const newElements = [...state.elements];
      newElements[elementIndex] = newState;
      
      return {
        elements: newElements,
        ...historyUpdate,
      };
    });
  },

  // Delete an element from the canvas
  deleteElement: (id: string) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      
      if (!element) return state;
      
      const action: Action = {
        type: 'delete',
        elementId: id,
        previousState: element,
      };
      
      const historyUpdate = recordAction(state, action);
      
      return {
        elements: state.elements.filter((el) => el.id !== id),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        ...historyUpdate,
      };
    });
  },

  // Set the currently selected element
  setSelectedElement: (id: string | null) => {
    set({ selectedElementId: id });
  },

  // Clear all elements from the canvas
  clearCanvas: () => {
    set((state) => {
      const action: Action = {
        type: 'clear',
        previousElements: state.elements,
      };
      
      const historyUpdate = recordAction(state, action);
      
      return {
        elements: [],
        selectedElementId: null,
        canvasBackground: null,
        ...historyUpdate,
      };
    });
  },

  // Set canvas background
  setCanvasBackground: (background: string | null) => {
    set({ canvasBackground: background });
  },

  // Undo the last action
  undo: () => {
    set((state) => {
      if (state.historyIndex < 0) return state;
      
      const action = state.actionHistory[state.historyIndex];
      let newElements = [...state.elements];
      let newBackground = state.canvasBackground;
      
      switch (action.type) {
        case 'add':
          // Remove the added element
          newElements = newElements.filter((el) => el.id !== action.elementId);
          break;
          
        case 'update':
          // Restore previous state
          if (action.previousState) {
            const index = newElements.findIndex((el) => el.id === action.elementId);
            if (index !== -1) {
              newElements[index] = action.previousState;
            }
          }
          break;
          
        case 'delete':
          // Restore deleted element
          if (action.previousState) {
            newElements.push(action.previousState);
          }
          break;
          
        case 'clear':
          // Restore all elements
          if (action.previousElements) {
            newElements = action.previousElements;
          }
          break;
      }
      
      return {
        elements: newElements,
        canvasBackground: newBackground,
        historyIndex: state.historyIndex - 1,
      };
    });
  },

  // Redo the previously undone action
  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.actionHistory.length - 1) return state;
      
      const nextIndex = state.historyIndex + 1;
      const action = state.actionHistory[nextIndex];
      let newElements = [...state.elements];
      let newBackground = state.canvasBackground;
      
      switch (action.type) {
        case 'add':
          // Re-add the element
          if (action.newState) {
            newElements.push(action.newState);
          }
          break;
          
        case 'update':
          // Apply the new state
          if (action.newState) {
            const index = newElements.findIndex((el) => el.id === action.elementId);
            if (index !== -1) {
              newElements[index] = action.newState;
            }
          }
          break;
          
        case 'delete':
          // Remove the element again
          newElements = newElements.filter((el) => el.id !== action.elementId);
          break;
          
        case 'clear':
          // Clear all elements again
          newElements = [];
          newBackground = null;
          break;
      }
      
      return {
        elements: newElements,
        canvasBackground: newBackground,
        historyIndex: nextIndex,
      };
    });
  },

  // Check if undo is available
  canUndo: () => {
    const state = get();
    return state.historyIndex >= 0;
  },

  // Check if redo is available
  canRedo: () => {
    const state = get();
    return state.historyIndex < state.actionHistory.length - 1;
  },
}));
