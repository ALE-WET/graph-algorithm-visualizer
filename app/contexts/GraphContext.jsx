import React, { createContext, useState, useContext } from 'react';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  // State management for graph elements and interactions
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [edgeIdCounter, setEdgeIdCounter] = useState(0);

  // State for tracking node selections during edge operations
  const [selectedNodeForEdgeAddition, setSelectedNodeForEdgeAddition] = useState(null);
  const [selectedNodeForEdgeDeletion, setSelectedNodeForEdgeDeletion] = useState(null);

  // Add a new node to the graph
  const addNode = (x, y) => {
    setNodeIdCounter(prev => {
      const newNode = {
        id: `node-${prev}`,
        x,
        y
      };
      setNodes(existing => [...existing, newNode]);
      return prev + 1;
    });
  };

  // Add an edge between two nodes
  const addEdge = (fromNodeId, toNodeId) => {

    if (fromNodeId === toNodeId) return;

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

  const clearGraph = () => {
    setEdges([]);
    setNodes([]);
    setNodeIdCounter(0);
    setEdgeIdCounter(0);
  }

  // Remove an edge between two nodes
  const removeEdge = (fromNodeId, toNodeId) => {
    setEdges(prev =>
      prev.filter(edge =>
        !(edge.from === fromNodeId && edge.to === toNodeId)
      )
    );
  };

  // Remove a node and its associated edges
  const removeNode = (nodeId) => {
    // Remove the node
    setNodes(prev => prev.filter(node => node.id !== nodeId));

    // Remove any edges connected to this node
    setEdges(prev => prev.filter(edge =>
      edge.from !== nodeId && edge.to !== nodeId
    ));
  };

  // Update the position of a node
  const updateNodePosition = (nodeId, x, y) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId
          ? { ...node, x, y }
          : node
      )
    );
  };

  // Handle node selection for edge addition
  const selectNodeForEdgeAddition = (nodeId) => {
    if (selectedNodeForEdgeAddition === null) {
      // First node selected
      setSelectedNodeForEdgeAddition(nodeId);
    } else {
      // Second node selected, create edge
      addEdge(selectedNodeForEdgeAddition, nodeId);
      // Reset selected node
      resetEdgeSelection();
    }
  };

  // Handle node selection for edge deletion
  const selectNodeForEdgeDeletion = (nodeId) => {
    if (selectedNodeForEdgeDeletion === null) {
      // First node selected for edge deletion
      setSelectedNodeForEdgeDeletion(nodeId);
    } else {
      // Second node selected, remove edge
      removeEdge(selectedNodeForEdgeDeletion, nodeId);
      // Reset selected node
      resetEdgeSelection();
    }
  };

  // Reset edge selection state
  const resetEdgeSelection = () => {
    setSelectedNodeForEdgeAddition(null);
    setSelectedNodeForEdgeDeletion(null);
  };

  console.log("edges", edges);
  console.log("Nodes", nodes);

  return (
    <GraphContext.Provider value={{
      nodes,
      edges,
      selectedAlgorithm,
      setSelectedAlgorithm,
      selectedNodeForEdgeAddition,
      selectedNodeForEdgeDeletion,
      addNode,
      removeNode,
      updateNodePosition,
      addEdge,
      removeEdge,
      selectNodeForEdgeAddition,
      selectNodeForEdgeDeletion,
      resetEdgeSelection,
      clearGraph
    }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);