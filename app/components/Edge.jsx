import React from "react"

const Edge = ({
    nodeFrom,
    nodeTo,
    edgeInformation
}) => {
    // Calculate the vector from start to end
    const dx = nodeTo.x - nodeFrom.x;
    const dy = nodeTo.y - nodeFrom.y;
    
    // Calculate the total length of the line
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate the unit vector
    const unitX = dx / length;
    const unitY = dy / length;
    
    // Subtract a small offset (10 pixels) from the end point
    const endX = nodeTo.x - unitX * 21;
    const endY = nodeTo.y - unitY * 21;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute z-0 pointer-events-none overflow-visible" 
            width="100%"
            height="100%"
            style={{
                position: 'absolute',
                left: 0,
                top: 0
            }}
        >
            <defs>
                <marker 
                    id={`arrowhead-${edgeInformation.id}`}
                    markerWidth="10" 
                    markerHeight="7" 
                    refX="9" 
                    refY="3.5" 
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
            <line
                key={`${edgeInformation.id}`}
                x1={nodeFrom.x}
                y1={nodeFrom.y}
                x2={endX}
                y2={endY}
                stroke="black"
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${edgeInformation.id})`}
            />
        </svg>
    );
}

export default Edge;