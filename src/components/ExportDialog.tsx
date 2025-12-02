import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { PresetSize } from '../types';
import { PRESET_DIMENSIONS } from '../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (name: string, presetSize: PresetSize) => void;
}

/**
 * ExportDialog component for naming and sizing poster exports
 * Provides preset size options for social media platforms
 */
export const ExportDialog = ({ isOpen, onClose, onExport }: ExportDialogProps) => {
  const [posterName, setPosterName] = useState('my-poster');
  const [selectedPreset, setSelectedPreset] = useState<PresetSize>(null);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(posterName, selectedPreset);
    onClose();
  };

  const presetOptions: Array<{ value: PresetSize; label: string; dimensions: string }> = [
    { value: null, label: 'Original Size', dimensions: 'Current canvas size' },
    { 
      value: 'instagram-story', 
      label: 'Instagram Story', 
      dimensions: `${PRESET_DIMENSIONS['instagram-story'].width}×${PRESET_DIMENSIONS['instagram-story'].height}` 
    },
    { 
      value: 'instagram-post', 
      label: 'Instagram Post', 
      dimensions: `${PRESET_DIMENSIONS['instagram-post'].width}×${PRESET_DIMENSIONS['instagram-post'].height}` 
    },
    { 
      value: 'whatsapp', 
      label: 'WhatsApp', 
      dimensions: `${PRESET_DIMENSIONS['whatsapp'].width}×${PRESET_DIMENSIONS['whatsapp'].height}` 
    },
    { 
      value: 'twitter', 
      label: 'Twitter/X', 
      dimensions: `${PRESET_DIMENSIONS['twitter'].width}×${PRESET_DIMENSIONS['twitter'].height}` 
    },
  ];

  const dialogContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      style={{ 
        zIndex: 9999, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Export Poster</h2>

        {/* Poster Name Input */}
        <div className="mb-4">
          <label htmlFor="poster-name" className="block text-sm font-medium text-gray-700 mb-2">
            Poster Name
          </label>
          <input
            id="poster-name"
            type="text"
            value={posterName}
            onChange={(e) => setPosterName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter poster name"
          />
          <p className="text-xs text-gray-500 mt-1">
            File will be saved as: {posterName || 'my-poster'}.png
          </p>
        </div>

        {/* Preset Size Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Size
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {presetOptions.map((option) => (
              <label
                key={option.value || 'original'}
                className="flex items-center p-2.5 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="preset-size"
                  value={option.value || 'original'}
                  checked={selectedPreset === option.value}
                  onChange={() => setSelectedPreset(option.value)}
                  className="mr-3 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.dimensions}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );

  // Render dialog using portal to ensure it's at the top level
  return createPortal(dialogContent, document.body);
};
