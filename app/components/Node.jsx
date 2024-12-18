import React from 'react';

const Node = ({
  node,
  onDragStart,
  isRemovingMode,
  onRemove,
  isAddingEdge,
  isRemovingEdge,
  isSelectedForEdgeAddition,
  isSelectedForEdgeDeletion,
  onSelect
}) => {
  // Handle different interactions based on current mode
  const handleMouseDown = (e) => {
    if (isRemovingMode) {
      // If in remove mode, trigger node removal
      onRemove();
    } else if (isAddingEdge || isRemovingEdge) {
      // If in edge mode, select node
      onSelect();
    } else {
      // Otherwise, initiate drag
      onDragStart(e, node);
    }
  };

  // Extract just the number from the node ID
  const nodeNumber = node.id.split('-')[1];

  // Determine node background color based on current mode and selection
  const getNodeBackground = () => {
    if (isRemovingMode) {
      return 'bg-red-500 hover:bg-red-600';
    }

    if (isAddingEdge) {
      return isSelectedForEdgeAddition
        ? 'bg-green-500 border-4 border-green-700'
        : 'bg-blue-500 hover:bg-blue-600';
    }

    if (isRemovingEdge) {
      return isSelectedForEdgeDeletion
        ? 'bg-red-500 border-4 border-red-700'
        : 'bg-blue-500 hover:bg-blue-600';
    }

    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div
      className={`absolute node-container w-10 h-10 z-10 rounded-full cursor-move select-none text-black flex items-center justify-center ${getNodeBackground()} 
    before:absolute before:inset-[-0.5rem] before:z-[-1]`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`
      }}
      onMouseDown={handleMouseDown}
    >
      {nodeNumber}
    </div>
  );
};

export default Node;