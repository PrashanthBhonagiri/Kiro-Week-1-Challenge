import { useStore } from '../store';
import { createTextElement } from '../utils';

interface ToolbarProps {
  className?: string;
}

/**
 * Toolbar component with primary actions
 * Provides buttons for undo, redo, clear, and adding elements
 */
export const Toolbar = ({ className = '' }: ToolbarProps) => {
  const canUndo = useStore((state) => state.canUndo());
  const canRedo = useStore((state) => state.canRedo());
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const clearCanvas = useStore((state) => state.clearCanvas);
  const addElement = useStore((state) => state.addElement);

  const handleAddText = () => {
    const textElement = createTextElement();
    addElement(textElement);
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {/* History controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
      </div>

      {/* Element controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={handleAddText}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          title="Add Text"
        >
          Add Text
        </button>
      </div>

      {/* Canvas controls */}
      <div className="flex gap-1">
        <button
          onClick={clearCanvas}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Clear Canvas"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
