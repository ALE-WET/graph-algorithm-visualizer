"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGraph } from '../contexts/GraphContext';
import Node from './Node';
import ModeSelector from './ModeSelector';
import GraphEditorControls from './GraphEditorControls';
import AlgorithmControls from './AlgorithmControls';
import Edge from './Edge.jsx';

// Constants for canvas sizing and initial positioning
const CANVAS_SIZE = 100000; // Extremely large canvas to allow extensive graph creation
const INITIAL_OFFSET = CANVAS_SIZE / 2; // Center the initial view

const GraphEditor = () => {
    // State Management for Graph Interaction Modes
    const [mode, setMode] = useState('edit');
    const [isAddingNodes, setIsAddingNodes] = useState(false);
    const [isRemovingNodes, setIsRemovingNodes] = useState(false);
    const [isAddingEdge, setIsAddingEdge] = useState(false);
    const [isRemovingEdge, setIsRemovingEdge] = useState(false);

    // Utilize the graph context for managing graph state and operations
    const {
        nodes,
        edges,
        addNode,
        removeNode,
        updateNodePosition,
        selectNodeForEdgeAddition,
        selectNodeForEdgeDeletion,
        selectedNodeForEdgeAddition,
        selectedNodeForEdgeDeletion,
        resetEdgeSelection
    } = useGraph();

    // Canvas Interaction State Management
    const [canvasOffset, setCanvasOffset] = useState({
        x: -INITIAL_OFFSET,
        y: -INITIAL_OFFSET
    });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const [isDraggingNode, setIsDraggingNode] = useState(null);

    // Reference to the canvas element for coordinate calculations
    const editorRef = useRef(null);

    // Calculate relative coordinates considering canvas offset
    const getRelativeCoordinates = useCallback((event) => {
        if (!editorRef.current) return { x: 0, y: 0 };

        const rect = editorRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left - canvasOffset.x,
            y: event.clientY - rect.top - canvasOffset.y
        };
    }, [canvasOffset]);

    // Canvas Dragging Handlers
    const handleCanvasDragStart = useCallback((e) => {
        // Prevent canvas drag during specific interactions
        if (!isDraggingNode && !isAddingNodes && !isRemovingNodes && !isAddingEdge && !isRemovingEdge) {
            setIsDraggingCanvas(true);
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    }, [isDraggingNode, isAddingNodes, isRemovingNodes, isAddingEdge, isRemovingEdge]);

    const handleCanvasDragMove = useCallback((e) => {
        if (isDraggingCanvas && !isDraggingNode) {
            const deltaX = e.clientX - lastMousePosition.x;
            const deltaY = e.clientY - lastMousePosition.y;

            setCanvasOffset(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }));

            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    }, [isDraggingCanvas, lastMousePosition, isDraggingNode]);

    const handleCanvasDragEnd = useCallback(() => {
        setIsDraggingCanvas(false);
    }, []);

    // Handle Node and Canvas Interactions
    const handleCanvasClick = (e) => {
        if (isAddingNodes) {
            const { x, y } = getRelativeCoordinates(e);
            addNode(x, y);
        }
    };

    const handleNodeDragStart = (e, node) => {
        const { x, y } = getRelativeCoordinates(e);
        setIsDraggingNode({
            node,
            offsetX: x - node.x,
            offsetY: y - node.y
        });
    };

    const handleNodeSelect = (node) => {
        if (isAddingEdge) {
            selectNodeForEdgeAddition(node.id);
        } else if (isRemovingEdge) {
            selectNodeForEdgeDeletion(node.id);
        }
    };

    const handleNodeDragMove = (e) => {
        if (isDraggingNode) {
            const { x, y } = getRelativeCoordinates(e);
            updateNodePosition(
                isDraggingNode.node.id,
                x - isDraggingNode.offsetX,
                y - isDraggingNode.offsetY
            );
        }
    };

    const handleNodeDragEnd = () => {
        setIsDraggingNode(null);
    };

    // Reset modes and edge selections when changing modes
    useEffect(() => {
        setIsAddingNodes(false);
        setIsRemovingNodes(false);
        setIsAddingEdge(false);
        setIsRemovingEdge(false);
        resetEdgeSelection();
    }, [mode]);

    // Mode Toggle Handlers
    const toggleMode = (modeToToggle) => {
        const modes = {
            addNodes: () => {
                setIsAddingNodes(!isAddingNodes);
                setIsRemovingNodes(false);
                setIsAddingEdge(false);
                setIsRemovingEdge(false);
            },
            removeNodes: () => {
                setIsRemovingNodes(!isRemovingNodes);
                setIsAddingNodes(false);
                setIsAddingEdge(false);
                setIsRemovingEdge(false);
            },
            addEdge: () => {
                setIsAddingEdge(!isAddingEdge);
                setIsAddingNodes(false);
                setIsRemovingEdge(false);
                setIsRemovingNodes(false);
            },
            removeEdge: () => {
                setIsRemovingEdge(!isRemovingEdge);
                setIsAddingEdge(false);
                setIsRemovingNodes(false);
                setIsAddingNodes(false);
            }
        };

        modes[modeToToggle]();
    };

    return (
        <div
            className="flex h-full relative"
            onMouseMove={handleCanvasDragMove}
            onMouseUp={() => {
                handleCanvasDragEnd();
                handleNodeDragEnd();
            }}
            onMouseLeave={() => {
                handleCanvasDragEnd();
                handleNodeDragEnd();
            }}
        >
            {/* Mode Selector */}
            <ModeSelector
                mode={mode}
                onModeChange={(newMode) => setMode(newMode)}
            />

            {/* Mode-Specific Controls */}
            {mode === 'edit' && (
                <GraphEditorControls
                    isAddingNodes={isAddingNodes}
                    isRemovingNodes={isRemovingNodes}
                    isAddingEdge={isAddingEdge}
                    isRemovingEdge={isRemovingEdge}
                    onToggleAddNodes={() => toggleMode('addNodes')}
                    onToggleRemoveNodes={() => toggleMode('removeNodes')}
                    onToggleAddEdge={() => toggleMode('addEdge')}
                    onToggleRemoveEdge={() => toggleMode('removeEdge')}
                />
            )}

            {mode === 'algorithm' && <AlgorithmControls />}

            {/* Graph Editor Canvas */}
            <div className="relative flex-grow overflow-hidden">
                <div
                    ref={editorRef}
                    className="absolute inset-0 border-2 border-gray-300 bg-gray-50 overflow-hidden cursor-move z-1"
                    onMouseDown={handleCanvasDragStart}
                    onClick={handleCanvasClick}
                >
                    {/* Infinite Background Grid */}
                    <div
                        className="absolute opacity-20 bg-repeat z-1"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)',
                            backgroundSize: '25px 25px',
                            width: `${CANVAS_SIZE}px`,
                            height: `${CANVAS_SIZE}px`,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                        }}
                    />

                    {/* Nodes with Canvas Offset */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                        }}
                    >
                        {edges.map(edge => {
                            const fromNode = nodes.find(n => n.id === edge.from);
                            const toNode = nodes.find(n => n.id === edge.to);

                            if (!fromNode || !toNode) return null;

                            return (
                                <Edge
                                    key={edge.id}
                                    nodeFrom={{
                                        x: fromNode.x + 20,  // Center offset
                                        y: fromNode.y + 20
                                    }}
                                    nodeTo={{
                                        x: toNode.x + 20,    // Center offset
                                        y: toNode.y + 20
                                    }}
                                    edgeInformation={edge}
                                />
                            );
                        })}
                    </div>

                    {/* Nodes with Canvas Offset - Now after edges */}
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                        }}
                        onMouseMove={handleNodeDragMove}
                    >
                        {nodes.map(node => (
                            <Node
                                key={node.id}
                                node={node}
                                onDragStart={handleNodeDragStart}
                                isRemovingMode={isRemovingNodes}
                                onRemove={() => removeNode(node.id)}
                                isAddingEdge={isAddingEdge}
                                isRemovingEdge={isRemovingEdge}
                                isSelectedForEdgeAddition={selectedNodeForEdgeAddition === node.id}
                                isSelectedForEdgeDeletion={selectedNodeForEdgeDeletion === node.id}
                                onSelect={() => handleNodeSelect(node)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphEditor;