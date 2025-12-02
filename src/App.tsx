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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Simple Poster Generator</h1>
        
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
          <Toolbar />
          
          {/* Export button */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={handleExportClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Export Poster
            </button>
          </div>

          {/* Export error message */}
          {exportError && (
            <div className="mt-2 text-red-600 text-sm" role="alert">
              {exportError}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <Canvas ref={canvasRef} width={800} height={600} />
          </div>

          {/* Properties Panel */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <PropertiesPanel />
          </div>
        </div>
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
