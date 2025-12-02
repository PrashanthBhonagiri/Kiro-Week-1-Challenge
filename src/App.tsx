import './App.css'
import { Canvas, Toolbar, PropertiesPanel } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Simple Poster Generator</h1>
        
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
          <Toolbar />
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <Canvas width={800} height={600} />
          </div>

          {/* Properties Panel */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
