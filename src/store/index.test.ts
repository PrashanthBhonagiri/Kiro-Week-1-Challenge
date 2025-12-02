import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './index';
import type { TextElement, LineElement } from '../types/canvas';

describe('Store - State Management', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useStore.getState();
    store.clearCanvas();
    // Reset history after clear
    useStore.setState({ actionHistory: [], historyIndex: -1 });
  });

  describe('addElement', () => {
    it('should add a text element to the canvas', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello World',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      
      const state = useStore.getState();
      expect(state.elements).toHaveLength(1);
      expect(state.elements[0]).toEqual(textElement);
    });

    it('should record add action in history', () => {
      const store = useStore.getState();
      
      const lineElement: LineElement = {
        id: 'line-1',
        type: 'line',
        x: 50,
        y: 50,
        rotation: 0,
        zIndex: 1,
        length: 100,
        thickness: 2,
        color: '#000000',
      };

      store.addElement(lineElement);
      
      const state = useStore.getState();
      expect(state.actionHistory).toHaveLength(1);
      expect(state.actionHistory[0].type).toBe('add');
      expect(state.actionHistory[0].elementId).toBe('line-1');
      expect(state.historyIndex).toBe(0);
    });
  });

  describe('updateElement', () => {
    it('should update an existing element', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.updateElement('text-1', { content: 'Updated', fontSize: 32 });
      
      const state = useStore.getState();
      const updated = state.elements[0] as TextElement;
      expect(updated.content).toBe('Updated');
      expect(updated.fontSize).toBe(32);
      expect(updated.fontFamily).toBe('Arial'); // Unchanged property
    });

    it('should record update action in history', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.updateElement('text-1', { x: 200 });
      
      const state = useStore.getState();
      expect(state.actionHistory).toHaveLength(2);
      expect(state.actionHistory[1].type).toBe('update');
      expect(state.actionHistory[1].previousState?.x).toBe(100);
      expect(state.actionHistory[1].newState?.x).toBe(200);
    });
  });

  describe('deleteElement', () => {
    it('should delete an element from the canvas', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      expect(useStore.getState().elements).toHaveLength(1);
      
      store.deleteElement('text-1');
      expect(useStore.getState().elements).toHaveLength(0);
    });

    it('should clear selected element if deleted', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.setSelectedElement('text-1');
      expect(useStore.getState().selectedElementId).toBe('text-1');
      
      store.deleteElement('text-1');
      expect(useStore.getState().selectedElementId).toBeNull();
    });
  });

  describe('clearCanvas', () => {
    it('should remove all elements', () => {
      const store = useStore.getState();
      
      const text: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      const line: LineElement = {
        id: 'line-1',
        type: 'line',
        x: 50,
        y: 50,
        rotation: 0,
        zIndex: 1,
        length: 100,
        thickness: 2,
        color: '#000000',
      };

      store.addElement(text);
      store.addElement(line);
      expect(useStore.getState().elements).toHaveLength(2);
      
      store.clearCanvas();
      const state = useStore.getState();
      expect(state.elements).toHaveLength(0);
      expect(state.selectedElementId).toBeNull();
      expect(state.canvasBackground).toBeNull();
    });
  });

  describe('undo/redo', () => {
    it('should undo add action', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      expect(useStore.getState().elements).toHaveLength(1);
      
      store.undo();
      expect(useStore.getState().elements).toHaveLength(0);
    });

    it('should redo add action', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.undo();
      expect(useStore.getState().elements).toHaveLength(0);
      
      store.redo();
      expect(useStore.getState().elements).toHaveLength(1);
      expect(useStore.getState().elements[0]).toEqual(textElement);
    });

    it('should undo update action', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.updateElement('text-1', { x: 200 });
      
      expect((useStore.getState().elements[0] as TextElement).x).toBe(200);
      
      store.undo();
      expect((useStore.getState().elements[0] as TextElement).x).toBe(100);
    });

    it('should undo delete action', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.deleteElement('text-1');
      expect(useStore.getState().elements).toHaveLength(0);
      
      store.undo();
      expect(useStore.getState().elements).toHaveLength(1);
      expect(useStore.getState().elements[0]).toEqual(textElement);
    });
  });

  describe('canUndo/canRedo', () => {
    it('should return false when no actions exist', () => {
      const store = useStore.getState();
      expect(store.canUndo()).toBe(false);
      expect(store.canRedo()).toBe(false);
    });

    it('should return true for canUndo after action', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      expect(store.canUndo()).toBe(true);
      expect(store.canRedo()).toBe(false);
    });

    it('should return true for canRedo after undo', () => {
      const store = useStore.getState();
      
      const textElement: TextElement = {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
        content: 'Hello',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        width: 200,
        height: 50,
      };

      store.addElement(textElement);
      store.undo();
      
      expect(store.canUndo()).toBe(false);
      expect(store.canRedo()).toBe(true);
    });
  });
});
