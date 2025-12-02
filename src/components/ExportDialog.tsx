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
  const [isExporting, setIsExporting] = useState(false);

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

  // Reset exporting state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(posterName, selectedPreset);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
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
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
      style={{ zIndex: 9999 }}
      onClick={!isExporting ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md my-8 transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h2 id="export-dialog-title" className="text-2xl font-bold text-gray-900">Export Poster</h2>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Poster Name Input */}
        <div className="mb-5">
          <label htmlFor="poster-name" className="label">
            Poster Name
          </label>
          <input
            id="poster-name"
            type="text"
            value={posterName}
            onChange={(e) => setPosterName(e.target.value)}
            className="input w-full"
            placeholder="Enter poster name"
            disabled={isExporting}
            aria-label="Enter poster name"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            File will be saved as: <span className="font-semibold text-gray-700">{posterName || 'my-poster'}.png</span>
          </p>
        </div>

        {/* Preset Size Selector */}
        <div className="mb-6">
          <label className="label">
            Export Size
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
            {presetOptions.map((option) => (
              <label
                key={option.value || 'original'}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPreset === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="preset-size"
                  value={option.value || 'original'}
                  checked={selectedPreset === option.value}
                  onChange={() => setSelectedPreset(option.value)}
                  className="mr-3 flex-shrink-0 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isExporting}
                  aria-label={`Export size: ${option.label}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{option.dimensions}</div>
                </div>
                {selectedPreset === option.value && (
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="btn btn-secondary"
            aria-label="Cancel export"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-primary min-w-[120px]"
            aria-label="Export poster as PNG"
          >
            {isExporting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Exporting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PNG
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render dialog using portal to ensure it's at the top level
  return createPortal(dialogContent, document.body);
};
