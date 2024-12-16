import React from 'react';

const Node = ({
  node,
  onDragStart,
  isRemovingMode,
  onRemove,
  isAddingEdge,
  isRemovingEdge,
  isSelectedForEdge,
  onSelect
}) => {
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

  return (
    <div
      className={`absolute w-10 h-10 rounded-full cursor-move select-none text-black flex items-center justify-center ${
        isRemovingMode
          ? 'bg-red-500 hover:bg-red-600'
          : isAddingEdge || isRemovingEdge
            ? (isSelectedForEdge
              ? 'bg-green-500'
              : 'bg-blue-500 hover:bg-blue-600')
            : 'bg-blue-500 hover:bg-blue-600'
      }`}
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