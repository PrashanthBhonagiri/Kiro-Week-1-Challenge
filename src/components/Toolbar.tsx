import { useRef, useState } from 'react';
import { useStore } from '../store';
import { createTextElement, createImageElement, validateImageFile, loadImageFile } from '../utils';

interface ToolbarProps {
  className?: string;
}

/**
 * Toolbar component with primary actions
 * Provides buttons for undo, redo, clear, and adding elements
 */
export const Toolbar = ({ className = '' }: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canUndo = useStore((state) => state.canUndo());
  const canRedo = useStore((state) => state.canRedo());
  const selectedElementId = useStore((state) => state.selectedElementId);
  const canvasBackground = useStore((state) => state.canvasBackground);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const clearCanvas = useStore((state) => state.clearCanvas);
  const addElement = useStore((state) => state.addElement);
  const deleteElement = useStore((state) => state.deleteElement);
  const setCanvasBackground = useStore((state) => state.setCanvasBackground);

  const handleAddText = () => {
    const textElement = createTextElement();
    addElement(textElement);
  };

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const handleLogoUploadClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Load image and get dimensions
      const { src, width, height } = await loadImageFile(file);

      // Create image element
      const imageElement = createImageElement(src, width, height);
      addElement(imageElement);

      // Clear error and reset input
      setUploadError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to load image');
    }
  };

  const handleBackgroundUploadClick = () => {
    setUploadError(null);
    backgroundInputRef.current?.click();
  };

  const handleBackgroundFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Load image
      const { src } = await loadImageFile(file);

      // Set as canvas background
      setCanvasBackground(src);

      // Clear error and reset input
      setUploadError(null);
      if (backgroundInputRef.current) {
        backgroundInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to load image');
    }
  };

  const handleRemoveBackground = () => {
    setCanvasBackground(null);
  };

  return (
    <div className={className}>
      <div className="flex gap-2 items-center flex-wrap">
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
          <button
            onClick={handleLogoUploadClick}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            title="Upload Logo"
          >
            Upload Logo
          </button>
          <button
            onClick={handleDelete}
            disabled={!selectedElementId}
            className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Delete Selected Element (Delete)"
          >
            Delete
          </button>
        </div>

        {/* Background controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={handleBackgroundUploadClick}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            title="Upload Background Image"
          >
            Upload Background
          </button>
          <button
            onClick={handleRemoveBackground}
            disabled={!canvasBackground}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Remove Background Image"
          >
            Remove Background
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

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload logo image"
        />
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
          onChange={handleBackgroundFileChange}
          className="hidden"
          aria-label="Upload background image"
        />
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="mt-2 text-red-600 text-sm" role="alert">
          {uploadError}
        </div>
      )}
    </div>
  );
};
