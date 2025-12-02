import './App.css'
import { Canvas } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Simple Poster Generator</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Canvas width={800} height={600} />
        </div>
      </div>
    </div>
  )
}

export default App
