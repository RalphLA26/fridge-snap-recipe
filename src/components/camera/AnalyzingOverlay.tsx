
import React from "react";

const AnalyzingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fridge-400 mx-auto mb-4"></div>
        <p className="text-lg">Analyzing image...</p>
        <p className="text-sm text-gray-300 mt-2">Identifying ingredients...</p>
      </div>
    </div>
  );
};

export default AnalyzingOverlay;
