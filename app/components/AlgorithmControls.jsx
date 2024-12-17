import React from 'react';
import { useGraph } from '../contexts/GraphContext';

const AlgorithmControls = () => {
  const { selectedAlgorithm, setSelectedAlgorithm } = useGraph();

  const algorithms = [
    { name: 'Dijkstra', value: 'dijkstra' },
    { name: 'Breadth-First Search', value: 'bfs' },
    { name: 'Depth-First Search', value: 'dfs' }
  ];

  return (
    <div className="p-4 bg-gray-100 h-full border-l-4">
      <h2 className="text-xl mb-4 font-bold text-black text-center">Algorithms</h2>
      <div className="space-y-2">
        {algorithms.map(algo => (
          <button 
            key={algo.value}
            className={`w-full px-4 py-2 rounded transition-colors ${
              selectedAlgorithm === algo.value 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => setSelectedAlgorithm(
              selectedAlgorithm === algo.value ? null : algo.value
            )}
          >
            {algo.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmControls;