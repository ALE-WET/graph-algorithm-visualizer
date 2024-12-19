import React, { useState } from 'react';
import { useGraph } from '../contexts/GraphContext';

const GraphEdgeInputForm = ({ onSubmit }) => {
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

};


    const validateAndParseInput = (input) => {
        const inputEdges = input.split('\n').filter(line => line.trim());

        try {
            const parsedEdges = inputEdges.map(edge => {
                const [from, to] = edge.split(',').map(num => {
                    const parsed = parseInt(num.trim());
                    if (isNaN(parsed)) {
                        throw new Error(`Invalid number: ${num}`);
                    }
                    return parsed;
                });
                if (from === undefined || to === undefined) {
                    throw new Error('Each edge must have both a source and target node.');
                }
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
            const parsedEdges = validateAndParseInput(inputValue);
            onSubmit(parsedEdges);
        } catch (err) {
            setError(err.message);
        }

        createGraphFromInput(inputValue);

    };

    return (
        <div className="w-64 bg-gray-100 p-4 border-l-4">
            <h2 className="text-xl mb-4 font-bold text-black text-center">Graph Input</h2>
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
                        placeholder="1,2"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )}

                <div className="text-xs text-gray-600 mt-2">
                    <p className="font-medium mb-1">Format:</p>
                    <p>• Each line represents one edge</p>
                    <p>• Format: from,to (numbers only)</p>
                    <p>• Example:</p>
                    <pre className="bg-gray-200 p-1 rounded mt-1">
                        1,2{'\n'}2,1{'\n'}3,1
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