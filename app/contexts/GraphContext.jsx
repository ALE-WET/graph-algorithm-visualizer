import React, { createContext, useState, useContext } from 'react';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [idCounter, setIdCounter] = useState(0);
  const [edgeIdCounter, setEdgeIdCounter] = useState(0);
  
  // New state for edge selection
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);

  const addNode = (x, y) => {
    const newNode = {
      id: `node-${nodes.length + 1}-${idCounter}`,
      x,
      y
    };
    setIdCounter(prev => prev + 1);
    setNodes(prev => [...prev, newNode]);
    return newNode.id;
  };

  const addEdge = (fromNodeId, toNodeId) => {
    // Prevent adding an edge to the same node
    if (fromNodeId === toNodeId) return;

    // Check if the edge already exists
    const edgeExists = edges.some(
      edge => (edge.from === fromNodeId && edge.to === toNodeId)
    );

    if (!edgeExists) {
      const newEdge = { 
        id: `edge-${edgeIdCounter}`,
        from: fromNodeId, 
        to: toNodeId 
      };
      setEdgeIdCounter(prev => prev + 1);
      setEdges(prev => [...prev, newEdge]);
    }
  };

  const removeEdge = (edgeId) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId));
  };

  const removeEdgeByNodes = (fromNodeId, toNodeId) => {
    setEdges(prev => 
      prev.filter(edge => 
        !(edge.from === fromNodeId && edge.to === toNodeId)
      )
    );
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

  // New method to handle node selection for edge creation
  const selectNodeForEdge = (nodeId) => {
    if (selectedNodeForEdge === null) {
      // First node selected
      setSelectedNodeForEdge(nodeId);
    } else {
      // Second node selected, create edge
      addEdge(selectedNodeForEdge, nodeId);
      // Reset selected node
      setSelectedNodeForEdge(null);
    }
  };

  // Reset edge selection
  const resetEdgeSelection = () => {
    setSelectedNodeForEdge(null);
  };


  console.log(edges)

  return (
    <GraphContext.Provider value={{
      nodes,
      edges,
      selectedAlgorithm,
      setSelectedAlgorithm,
      selectedNodeForEdge,
      addNode,
      removeNode,
      updateNodePosition,
      addEdge,
      removeEdge,
      removeEdgeByNodes,
      selectNodeForEdge,
      resetEdgeSelection
    }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);