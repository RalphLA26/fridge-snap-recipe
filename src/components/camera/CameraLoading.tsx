
import React from "react";

interface CameraLoadingProps {
  message?: string;
}

const CameraLoading: React.FC<CameraLoadingProps> = ({ 
  message = "Initializing camera..." 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fridge-400 mb-4"></div>
      <p className="text-white text-xl font-medium mb-2">{message}</p>
      <p className="text-gray-400 text-sm text-center">Please allow camera permissions if prompted</p>
    </div>
  );
};

export default CameraLoading;
