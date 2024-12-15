"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGraph } from '../contexts/GraphContext';
import Node from './Node';
import ModeSelector from './ModeSelector';
import GraphEditorControls from './GraphEditorControls.jsx';
import AlgorithmControls from './AlgorithmControls';

const GraphEditor = () => {
    // Mode and interaction states
    const [mode, setMode] = useState('edit');
    const [isAddingNodes, setIsAddingNodes] = useState(false);
    const [isRemovingNodes, setIsRemovingNodes] = useState(false);

    // Graph management hooks from context
    const { 
        nodes, 
        edges, 
        addNode, 
        removeNode, 
        updateNodePosition 
    } = useGraph();

    // Canvas interaction states
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const [isDraggingNode, setIsDraggingNode] = useState(null);

    // Refs and canvas-related references
    const editorRef = useRef(null);

    // Get coordinates relative to the canvas, accounting for canvas offset
    const getRelativeCoordinates = useCallback((event) => {
        if (!editorRef.current) return { x: 0, y: 0 };
        
        const rect = editorRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left - canvasOffset.x,
            y: event.clientY - rect.top - canvasOffset.y
        };
    }, [canvasOffset]);

    // Canvas dragging handlers
    const handleCanvasDragStart = useCallback((e) => {
        // Prevent canvas drag if dragging a node
        if (!isDraggingNode) {
            setIsDraggingCanvas(true);
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        }
    }, [isDraggingNode]);

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

    // Handle node and canvas interactions
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

    // Reset adding/removing modes when changing mode
    useEffect(() => {
        setIsAddingNodes(false);
        setIsRemovingNodes(false);
    }, [mode]);

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
                    onToggleAddNodes={() => {
                        setIsAddingNodes(!isAddingNodes);
                        setIsRemovingNodes(false);
                    }}
                    onToggleRemoveNodes={() => {
                        setIsRemovingNodes(!isRemovingNodes);
                        setIsAddingNodes(false);
                    }}
                />
            )}

            {mode === 'algorithm' && (
                <AlgorithmControls />
            )}

            {mode === 'hide' && (
                <div></div>
            )}

            {/* Graph Editor Canvas Wrapper */}
            <div className="relative flex-grow overflow-hidden">
                {/* Graph Editor Canvas */}
                <div
                    ref={editorRef}
                    className="absolute inset-0 border-2 border-gray-300 bg-gray-50 
                               overflow-hidden cursor-move"
                    onMouseDown={handleCanvasDragStart}
                    onClick={handleCanvasClick}
                >
                    {/* Infinite Background Grid */}
                    <div 
                        className="absolute inset-0 opacity-20 bg-repeat"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)',
                            backgroundSize: '25px 25px',
                            width: '2000px',
                            height: '2000px',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                        }}
                    />

                    {/* Nodes with Canvas Offset Applied */}
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
                                node={{
                                    ...node,
                                    x: node.x,
                                    y: node.y
                                }}
                                onDragStart={handleNodeDragStart}
                                isRemovingMode={isRemovingNodes}
                                onRemove={() => removeNode(node.id)}
                            />
                        ))}
                    </div>

                    {/* Edges (Placeholder rendering) */}
                    {edges.length > 0 && (
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                            }}
                        >
                            {edges.map(edge => (
                                <div key={edge.id} className="text-xs text-red-500">
                                    Edge: {edge.from} → {edge.to}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GraphEditor;