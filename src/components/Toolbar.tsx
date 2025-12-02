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
        <div className="flex gap-2 border-r border-gray-300 pr-3 mr-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="btn btn-primary text-sm px-3 py-2"
            title="Undo last action"
            aria-label="Undo last action"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="btn btn-primary text-sm px-3 py-2"
            title="Redo last undone action"
            aria-label="Redo last undone action"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>

        {/* Element controls */}
        <div className="flex gap-2 border-r border-gray-300 pr-3 mr-1 flex-wrap">
          <button
            onClick={handleAddText}
            className="btn btn-success text-sm px-3 py-2"
            title="Add text element to canvas"
            aria-label="Add text element"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Add Text</span>
          </button>
          <button
            onClick={handleLogoUploadClick}
            className="btn btn-purple text-sm px-3 py-2"
            title="Upload logo image"
            aria-label="Upload logo image"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Upload Logo</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={!selectedElementId}
            className="btn btn-warning text-sm px-3 py-2"
            title="Delete selected element"
            aria-label="Delete selected element"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        {/* Background controls */}
        <div className="flex gap-2 border-r border-gray-300 pr-3 mr-1 flex-wrap">
          <button
            onClick={handleBackgroundUploadClick}
            className="btn btn-info text-sm px-3 py-2"
            title="Upload background image"
            aria-label="Upload background image"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="hidden sm:inline">Background</span>
          </button>
          <button
            onClick={handleRemoveBackground}
            disabled={!canvasBackground}
            className="btn btn-info text-sm px-3 py-2"
            title="Remove background image"
            aria-label="Remove background image"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Remove BG</span>
          </button>
        </div>

        {/* Canvas controls */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="btn btn-danger text-sm px-3 py-2"
            title="Clear entire canvas"
            aria-label="Clear entire canvas"
          >
            <svg className="w-4 h-4 sm:mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload logo image file"
        />
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
          onChange={handleBackgroundFileChange}
          className="hidden"
          aria-label="Upload background image file"
        />
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="error-message" role="alert" aria-live="polite">
          <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {uploadError}
        </div>
      )}
    </div>
  );
};
