import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Canvas, Toolbar, PropertiesPanel, ExportDialog } from './components'
import type { CanvasRef } from './components/Canvas'
import { useStore } from './store'
import { exportCanvasToPNG } from './utils/export'
import type { PresetSize } from './types'

function App() {
  const canvasRef = useRef<CanvasRef>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const selectedElementId = useStore((state) => state.selectedElementId);
  const deleteElement = useStore((state) => state.deleteElement);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key - delete selected element
      if (e.key === 'Delete' && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, deleteElement]);

  const handleExportClick = () => {
    setExportError(null);
    setIsExportDialogOpen(true);
  };

  const handleExport = async (name: string, presetSize: PresetSize) => {
    try {
      const fabricCanvas = canvasRef.current?.getFabricCanvas();
      if (!fabricCanvas) {
        throw new Error('Canvas is not available');
      }

      await exportCanvasToPNG(fabricCanvas, name, presetSize);
      setExportError(null);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to export poster');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Simple Poster Generator
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create beautiful posters with text, images, and custom backgrounds
          </p>
        </header>
        
        {/* Toolbar */}
        <div className="card mb-4 sm:mb-6 p-4 sm:p-6">
          <Toolbar />
          
          {/* Export button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleExportClick}
              className="btn btn-primary w-full sm:w-auto"
              aria-label="Export poster as PNG"
            >
              <svg 
                className="inline-block w-5 h-5 mr-2 -ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              Export Poster
            </button>
          </div>

          {/* Export error message */}
          {exportError && (
            <div className="error-message" role="alert" aria-live="polite">
              <svg 
                className="inline-block w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              {exportError}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 card p-4 sm:p-6">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Canvas</h2>
              <p className="text-sm text-gray-600">
                Click and drag elements to reposition them
              </p>
            </div>
            <div className="overflow-x-auto">
              <Canvas ref={canvasRef} width={800} height={600} />
            </div>
          </div>

          {/* Properties Panel */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
            <PropertiesPanel />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Use keyboard shortcuts: Delete to remove elements</p>
        </footer>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}

export default App
