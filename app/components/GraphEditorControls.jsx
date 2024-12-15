import React from 'react';

const GraphEditorControls = ({ 
    isAddingNodes, 
    isRemovingNodes,
    onToggleAddNodes, 
    onToggleRemoveNodes 
}) => {
    return (
        <div className="w-64 bg-gray-100 h-full p-4">
            <h2 className="text-xl mb-4 font-bold text-black text-center">Graph Editing</h2>
            <div className="space-y-2">
                <button 
                    onClick={onToggleAddNodes}
                    className={`w-full px-4 py-2 rounded transition-colors ${
                        isAddingNodes 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isAddingNodes ? 'Stop Adding' : 'Add Node'}
                </button>
                <button 
                    onClick={onToggleRemoveNodes}
                    className={`w-full px-4 py-2 rounded transition-colors ${
                        isRemovingNodes 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isRemovingNodes ? 'Stop Removing' : 'Remove Node'}
                </button>
            </div>
        </div>
    );
};

export default GraphEditorControls;