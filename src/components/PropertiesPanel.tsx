import { useStore } from '../store';
import { COMMON_FONTS } from '../utils';
import type { TextElement } from '../types';

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
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  // Render text element properties
  if (selectedElement.type === 'text') {
    const textElement = selectedElement as TextElement;

    return (
      <div className={`p-4 bg-gray-50 rounded-lg space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Text Properties</h3>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            title="Delete Element (Delete)"
          >
            Delete
          </button>
        </div>

        {/* Font Family Selector */}
        <div>
          <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            id="font-family"
            value={textElement.fontFamily}
            onChange={(e) => updateElement(textElement.id, { fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
            Font Size: {textElement.fontSize}px
          </label>
          <input
            id="font-size"
            type="range"
            min="8"
            max="120"
            value={textElement.fontSize}
            onChange={(e) => updateElement(textElement.id, { fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex gap-2 mt-1">
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
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-sm text-gray-500 self-center">px</span>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="text-color"
              type="color"
              value={textElement.color}
              onChange={(e) => updateElement(textElement.id, { color: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Text Content */}
        <div>
          <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            id="text-content"
            value={textElement.content}
            onChange={(e) => updateElement(textElement.id, { content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Double-click text on canvas for inline editing
          </p>
        </div>
      </div>
    );
  }

  // Placeholder for other element types
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </h3>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          title="Delete Element (Delete)"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-500 text-sm">
        Properties for {selectedElement.type} elements coming soon
      </p>
    </div>
  );
};
