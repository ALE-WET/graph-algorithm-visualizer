"use client"
import { GraphProvider } from './contexts/GraphContext';
import GraphEditor from './components/GraphEditor';

export default function Home() {
  return (
    <GraphProvider>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-4">
        <header className="text-left">
          <h1 className="text-3xl font-bold mb-4">Graph Algorithm Visualizer</h1>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4">
          {/* This space is intentionally left empty for potential future controls */}
          <div></div>
          
          {/* Graph Editor Canvas */}
          <div className="border-2 border-gray-300 rounded-lg">
            <GraphEditor />
          </div>
          
          {/* Algorithm Controls */}
          {/* <div className="bg-gray-100 rounded-lg">
            <AlgorithmControls />
          </div> */}
        </main>
        
        <footer className="text-center text-sm text-gray-500">
          Graph Editor Pre-Alpha
        </footer>
      </div>
    </GraphProvider>
  );
}