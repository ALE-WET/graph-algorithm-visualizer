import React from 'react';

const ModeSelector = ({ mode, onModeChange }) => {
  const modes = [
    { name: 'Edit Graph', value: 'edit' },
    { name: 'Select Algorithm', value: 'algorithm' },
  ];

  const handleModeChange = (newMode) => {
    // If the clicked mode is already selected, hide the menu
    onModeChange(mode === newMode ? 'hide' : newMode);
  };

  return (
    <div className={`w-64 bg-gray-100 h-full p-4 transition-all duration-300`}>
      <h2 className="text-xl mb-4 font-bold text-black text-center">Modes</h2>
      <div className="space-y-2">
        {modes.map(m => (
          <button 
            key={m.value}
            className={`w-full px-4 py-2 rounded transition-colors ${
              mode === m.value 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => handleModeChange(m.value)}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;