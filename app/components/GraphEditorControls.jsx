import React from 'react';
import GraphEdgeInputForm from './GraphEdgeInputForm';

const GraphEditorControls = ({
    isAddingNodes,
    isRemovingNodes,
    isAddingEdge,
    isRemovingEdge,
    onToggleAddNodes,
    onToggleRemoveNodes,
    onToggleAddEdge,
    onToggleRemoveEdge,
    rectSize,
    getRectSize
}) => {
    return (
        <div className="w-80 bg-gray-100 h-full p-4 border-l-4">
            <h2 className="text-xl mb-4 font-bold text-black text-center">Graph Editing</h2>
            <div className="space-y-2">
                <button
                    onClick={onToggleAddNodes}
                    className={`w-full px-4 py-2 rounded transition-colors ${isAddingNodes
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    {isAddingNodes ? 'Stop Adding' : 'Add Node'}
                </button>
                <button
                    onClick={onToggleRemoveNodes}
                    className={`w-full px-4 py-2 rounded transition-colors ${isRemovingNodes
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    {isRemovingNodes ? 'Stop Removing' : 'Remove Node'}
                </button>
                <button
                    onClick={onToggleAddEdge}
                    className={`w-full px-4 py-2 rounded transition-colors ${isAddingEdge
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    {isAddingEdge ? 'Stop Adding Edge' : 'Add Edge'}
                </button>
                <button
                    onClick={onToggleRemoveEdge}
                    className={`w-full px-4 py-2 rounded transition-colors ${isRemovingEdge
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    {isRemovingEdge ? 'Stop Removing Edge' : 'Remove Edge'}
                </button>

                <GraphEdgeInputForm 
                onSubmit={(edges) => {}}
                rectSize = {rectSize}
                getRectSize = {getRectSize}
                />

            </div>
        </div>
    );
};

export default GraphEditorControls;