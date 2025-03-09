
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraErrorProps {
  error: Error;
  onRetry: () => void;
  onBack: () => void;
}

const CameraError = ({ error, onRetry, onBack }: CameraErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/95 text-white p-6 text-center">
      <div className="mb-4 bg-red-900/30 p-4 rounded-full">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-xl font-bold mb-2">Camera Error</h2>
      <p className="mb-6 text-gray-300 max-w-xs mx-auto">
        {error.message || "Could not access camera. Please check your permissions and try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onRetry} 
          variant="fridge"
        >
          Retry Camera
        </Button>
        <Button 
          onClick={onBack} 
          variant="outline"
          className="bg-gray-800 text-white border-gray-700"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CameraError;
