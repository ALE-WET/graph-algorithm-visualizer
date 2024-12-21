import React, { useState } from 'react';
import { useGraph } from '../contexts/GraphContext';

const CANVAS_SIZE = 100000;
const INITIAL_OFFSET = CANVAS_SIZE / 2;

const GraphEdgeInputForm = ({
    onSubmit,
    rectSize,
    getRectSize
}) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const {
        nodes,
        edges,
        addNode,
        addEdge,
        clearGraph
    } = useGraph();

    const createGraphFromInput = (input) => {
        // Clear existing graph first
        clearGraph();
    
        const lines = input.split('\n').filter(line => line.trim());
        const numberOfNodes = parseInt(lines[0]);
    
        if (isNaN(numberOfNodes) || numberOfNodes <= 0) {
            throw new Error('First line must be a positive number indicating the number of nodes');
        }
    
        // Get rect size if needed, but don't make node creation dependent on it
        if (rectSize.left === undefined) {
            getRectSize();
        }
    
        // Create nodes in a single pass
        const nodePositions = [];
        for (let i = 0; i < numberOfNodes; i++) {
            const finalX = INITIAL_OFFSET + Math.random() * 500;
            const finalY = INITIAL_OFFSET + Math.random() * 500;
            
            // Only add the node once
            addNode(finalX, finalY);
        }
    
        // Process edges after nodes are created
        for (let i = 1; i < lines.length; i++) {
            const [from, to] = lines[i].split(',').map(num => parseInt(num.trim()));
            if (from <= numberOfNodes && to <= numberOfNodes && from > 0 && to > 0) {
                const fromNodeId = `node-${from - 1}`;
                const toNodeId = `node-${to - 1}`;
                addEdge(fromNodeId, toNodeId);
            }
        }
    };

    const validateAndParseInput = (input) => {
        const inputLines = input.split('\n').filter(line => line.trim());

        try {
            // First line should be number of nodes
            const numberOfNodes = parseInt(inputLines[0]);
            if (isNaN(numberOfNodes) || numberOfNodes <= 0) {
                throw new Error('First line must be a positive number indicating the number of nodes');
            }

            // Parse remaining lines as edges
            const parsedEdges = inputLines.slice(1).map((edge, index) => {
                const [from, to] = edge.split(',').map(num => {
                    const parsed = parseInt(num.trim());
                    if (isNaN(parsed) || parsed <= 0 || parsed > numberOfNodes) {
                        throw new Error(`Invalid node number in edge ${index + 1}: ${num}`);
                    }
                    return parsed;
                });
                return [from, to];
            });

            return parsedEdges;
        } catch (err) {
            throw new Error(err.message || 'Invalid input format. Please check the example format below.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            // Validate input first
            const parsedEdges = validateAndParseInput(inputValue);
            // If validation passes, create the graph
            createGraphFromInput(inputValue);
            onSubmit(parsedEdges);
        } catch (err) {
            setError(err.message);
        }
    };

    // Rest of the component remains the same...
    return (
        <div className="w-64 bg-gray-100 p-4 border-l-4">
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <div>
                    <label
                        htmlFor="graphInput"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Enter Edge List
                    </label>
                    <textarea
                        id="graphInput"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:border-blue-500 transition-colors min-h-[120px]
                                 font-mono text-sm"
                        placeholder="3&#10;2,1&#10;1,2&#10;3,1"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )}

                <div className="text-xs text-gray-600 mt-2">
                    <p className="font-medium mb-1">Format:</p>
                    <p>• First line: number of nodes</p>
                    <p>• Each following line: from,to (numbers only)</p>
                    <p>• Node numbers start from 1</p>
                    <p>• Example:</p>
                    <pre className="bg-gray-200 p-1 rounded mt-1">
                        3{'\n'}1,2{'\n'}2,1{'\n'}3,1
                    </pre>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded 
                             hover:bg-blue-600 transition-colors disabled:opacity-50
                             disabled:cursor-not-allowed"
                    disabled={!inputValue.trim()}
                >
                    Create Graph
                </button>
            </form>
        </div>
    );
};

export default GraphEdgeInputForm;