import React, { createContext, useState, useContext } from 'react';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [idCounter, setIdCounter] = useState(0);

  const addNode = (x, y) => {
    const newNode = {
      id: `node-${nodes.length + 1}-${idCounter}`,
      x,
      y
    };
    setIdCounter(prev => prev + 1);
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (nodeId) => {
    // Remove the node
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    
    // Remove any edges connected to this node
    setEdges(prev => prev.filter(edge => 
      edge.from !== nodeId && edge.to !== nodeId
    ));
  };

  const updateNodePosition = (nodeId, x, y) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId 
          ? { ...node, x, y } 
          : node
      )
    );
  };

  return (
    <GraphContext.Provider value={{
      nodes,
      edges,
      selectedAlgorithm,
      setSelectedAlgorithm,
      addNode,
      removeNode,
      updateNodePosition
    }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);