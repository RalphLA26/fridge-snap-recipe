
import { AlertCircle, Camera, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CameraErrorProps {
  error: Error;
  onRetry: () => void;
  onBack: () => void;
}

const CameraError = ({ error, onRetry, onBack }: CameraErrorProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full w-full bg-black/95 text-white p-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 bg-red-900/30 p-4 rounded-full"
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-bold mb-2"
      >
        Camera Error
      </motion.h2>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 text-gray-300 max-w-xs mx-auto"
      >
        {error.message || "Could not access camera. Please check your permissions and try again."}
      </motion.p>
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button 
          onClick={onRetry} 
          variant="fridge"
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Retry Camera
        </Button>
        <Button 
          onClick={onBack} 
          variant="outline"
          className="bg-gray-800 text-white border-gray-700 flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CameraError;
