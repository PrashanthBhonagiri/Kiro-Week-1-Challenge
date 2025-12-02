import { useStore } from '../store';
import { COMMON_FONTS } from '../utils';
import type { TextElement, ImageElement } from '../types';

interface PropertiesPanelProps {
  className?: string;
}

/**
 * Properties panel component for editing selected element properties
 * Displays controls based on the selected element type
 */
export const PropertiesPanel = ({ className = '' }: PropertiesPanelProps) => {
  const elements = useStore((state) => state.elements);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const updateElement = useStore((state) => state.updateElement);
  const deleteElement = useStore((state) => state.deleteElement);

  // Find the selected element
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  if (!selectedElement) {
    return (
      <div className={`panel ${className}`}>
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-gray-500 text-sm font-medium">No element selected</p>
          <p className="text-gray-400 text-xs mt-1">Click an element on the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  // Render text element properties
  if (selectedElement.type === 'text') {
    const textElement = selectedElement as TextElement;

    return (
      <div className={`panel ${className}`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="font-semibold text-gray-800">Text Properties</h3>
          </div>
          <button
            onClick={handleDelete}
            className="btn btn-danger text-xs px-2 py-1"
            title="Delete text element"
            aria-label="Delete text element"
          >
            Delete
          </button>
        </div>

        {/* Font Family Selector */}
        <div>
          <label htmlFor="font-family" className="label">
            Font Family
          </label>
          <select
            id="font-family"
            value={textElement.fontFamily}
            onChange={(e) => updateElement(textElement.id, { fontFamily: e.target.value })}
            className="input w-full"
            aria-label="Select font family"
          >
            {COMMON_FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label htmlFor="font-size" className="label">
            Font Size: <span className="font-semibold text-blue-600">{textElement.fontSize}px</span>
          </label>
          <input
            id="font-size"
            type="range"
            min="8"
            max="120"
            value={textElement.fontSize}
            onChange={(e) => updateElement(textElement.id, { fontSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Adjust font size"
          />
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              min="8"
              max="120"
              value={textElement.fontSize}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 8 && value <= 120) {
                  updateElement(textElement.id, { fontSize: value });
                }
              }}
              className="input w-20 text-sm"
              aria-label="Font size in pixels"
            />
            <span className="text-sm text-gray-500 self-center">px</span>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label htmlFor="text-color" className="label">
            Text Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="text-color"
              type="color"
              value={textElement.color}
              onChange={(e) => updateElement(textElement.id, { color: e.target.value })}
              className="w-12 h-10 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              aria-label="Select text color"
            />
            <input
              type="text"
              value={textElement.color}
              onChange={(e) => {
                const value = e.target.value;
                // Basic validation for hex color
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  updateElement(textElement.id, { color: value });
                }
              }}
              className="input flex-1 text-sm font-mono"
              placeholder="#000000"
              aria-label="Text color hex code"
            />
          </div>
        </div>

        {/* Text Content */}
        <div>
          <label htmlFor="text-content" className="label">
            Text Content
          </label>
          <textarea
            id="text-content"
            value={textElement.content}
            onChange={(e) => updateElement(textElement.id, { content: e.target.value })}
            className="input w-full resize-none"
            rows={3}
            aria-label="Edit text content"
          />
          <div className="info-message flex items-start gap-1">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Tip: Double-click text on canvas for inline editing</span>
          </div>
        </div>
      </div>
    );
  }

  // Render image element properties
  if (selectedElement.type === 'image') {
    const imageElement = selectedElement as ImageElement;
    const aspectRatio = imageElement.width / imageElement.height;

    const handleWidthChange = (newWidth: number) => {
      // Maintain aspect ratio when changing width
      const newHeight = newWidth / aspectRatio;
      updateElement(imageElement.id, { 
        width: newWidth,
        height: newHeight,
      });
    };

    const handleHeightChange = (newHeight: number) => {
      // Maintain aspect ratio when changing height
      const newWidth = newHeight * aspectRatio;
      updateElement(imageElement.id, { 
        width: newWidth,
        height: newHeight,
      });
    };

    return (
      <div className={`panel ${className}`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-semibold text-gray-800">Image Properties</h3>
          </div>
          <button
            onClick={handleDelete}
            className="btn btn-danger text-xs px-2 py-1"
            title="Delete image element"
            aria-label="Delete image element"
          >
            Delete
          </button>
        </div>

        {/* Image Preview */}
        <div>
          <label className="label">
            Preview
          </label>
          <div className="border-2 border-gray-300 rounded-lg p-3 bg-white flex items-center justify-center hover:border-blue-400 transition-colors" style={{ minHeight: '120px' }}>
            <img 
              src={imageElement.src} 
              alt="Logo preview" 
              className="max-w-full max-h-32 object-contain"
            />
          </div>
        </div>

        {/* Width Control */}
        <div>
          <label htmlFor="image-width" className="label">
            Width: <span className="font-semibold text-blue-600">{Math.round(imageElement.width)}px</span>
          </label>
          <input
            id="image-width"
            type="range"
            min="20"
            max="800"
            value={imageElement.width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Adjust image width"
          />
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              min="20"
              max="800"
              value={Math.round(imageElement.width)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 20 && value <= 800) {
                  handleWidthChange(value);
                }
              }}
              className="input w-20 text-sm"
              aria-label="Image width in pixels"
            />
            <span className="text-sm text-gray-500 self-center">px</span>
          </div>
        </div>

        {/* Height Control */}
        <div>
          <label htmlFor="image-height" className="label">
            Height: <span className="font-semibold text-blue-600">{Math.round(imageElement.height)}px</span>
          </label>
          <input
            id="image-height"
            type="range"
            min="20"
            max="800"
            value={imageElement.height}
            onChange={(e) => handleHeightChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Adjust image height"
          />
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              min="20"
              max="800"
              value={Math.round(imageElement.height)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 20 && value <= 800) {
                  handleHeightChange(value);
                }
              }}
              className="input w-20 text-sm"
              aria-label="Image height in pixels"
            />
            <span className="text-sm text-gray-500 self-center">px</span>
          </div>
        </div>

        {/* Aspect Ratio Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs text-blue-800 font-semibold">
                Aspect Ratio: {aspectRatio.toFixed(2)}:1
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Width and height are locked to maintain aspect ratio
              </p>
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="image-x" className="label">
              X Position
            </label>
            <input
              id="image-x"
              type="number"
              value={Math.round(imageElement.x)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  updateElement(imageElement.id, { x: value });
                }
              }}
              className="input w-full text-sm"
              aria-label="Image X position"
            />
          </div>
          <div>
            <label htmlFor="image-y" className="label">
              Y Position
            </label>
            <input
              id="image-y"
              type="number"
              value={Math.round(imageElement.y)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  updateElement(imageElement.id, { y: value });
                }
              }}
              className="input w-full text-sm"
              aria-label="Image Y position"
            />
          </div>
        </div>

        {/* Rotation Control */}
        <div>
          <label htmlFor="image-rotation" className="label">
            Rotation: <span className="font-semibold text-blue-600">{Math.round(imageElement.rotation)}°</span>
          </label>
          <input
            id="image-rotation"
            type="range"
            min="0"
            max="360"
            value={imageElement.rotation}
            onChange={(e) => updateElement(imageElement.id, { rotation: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Adjust image rotation"
          />
        </div>
      </div>
    );
  }

  // Placeholder for other element types
  return (
    <div className={`panel ${className}`}>
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </h3>
        <button
          onClick={handleDelete}
          className="btn btn-danger text-xs px-2 py-1"
          title="Delete element"
          aria-label="Delete element"
        >
          Delete
        </button>
      </div>
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <p className="text-gray-500 text-sm">
          Properties for {selectedElement.type} elements coming soon
        </p>
      </div>
    </div>
  );
};
