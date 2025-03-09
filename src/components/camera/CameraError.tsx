
import React from "react";
import { XCircle, CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraErrorProps {
  error: string;
  facingMode: "user" | "environment";
  onToggleCamera: () => void;
  onClose: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ 
  error, 
  facingMode, 
  onToggleCamera, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-white text-xl mb-4 text-center font-medium">{error}</h2>
      <div className="space-y-3 w-full max-w-xs">
        <Button 
          onClick={onToggleCamera} 
          className="w-full bg-fridge-600 hover:bg-fridge-700"
        >
          <CameraIcon className="mr-2 h-4 w-4" />
          Try {facingMode === "user" ? "Back" : "Front"} Camera
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-gray-700 text-white hover:bg-gray-800"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CameraError;
