
import { AlertCircle, Camera, ChevronLeft, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CameraErrorProps {
  error: Error;
  onRetry: () => void;
  onBack: () => void;
}

const CameraError = ({ error, onRetry, onBack }: CameraErrorProps) => {
  // Determine if this is a permissions error
  const isPermissionError = error.message.toLowerCase().includes('permission') || 
                           error.message.toLowerCase().includes('not allowed');
  
  // Determine what OS-specific instructions to show
  const getMobileOSName = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) return "Android";
    if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS";
    return "your device";
  };
  
  const getPermissionInstructions = () => {
    const os = getMobileOSName();
    if (os === "Android") {
      return "Go to Settings → Apps → Your Browser → Permissions → Camera → Allow";
    } else if (os === "iOS") {
      return "Go to Settings → Your Browser → Camera → Allow";
    } else {
      return "Check your browser settings to allow camera access";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-black to-gray-900 text-white p-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-red-900/30 p-5 rounded-full"
      >
        <AlertCircle className="h-14 w-14 text-red-500" />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-3"
      >
        Camera Error
      </motion.h2>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 text-gray-300 max-w-sm mx-auto"
      >
        {error.message || "Could not access camera. Please check your permissions and try again."}
      </motion.p>
      
      {isPermissionError && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/70 rounded-lg p-4 mb-6 max-w-sm mx-auto border border-gray-700"
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-fridge-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-medium text-fridge-400 mb-1">How to enable camera access:</h3>
              <p className="text-sm text-gray-300">{getPermissionInstructions()}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-xs"
      >
        <Button 
          onClick={onRetry} 
          variant="fridge"
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Try Again
        </Button>
        <Button 
          onClick={onBack} 
          variant="outline"
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </Button>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-500 mt-8"
      >
        If the problem persists, try restarting your browser or device.
      </motion.p>
    </motion.div>
  );
};

export default CameraError;
