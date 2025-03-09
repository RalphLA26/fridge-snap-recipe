
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Camera as CameraIcon, 
  XCircle, 
  FlipHorizontal, 
  Barcode, 
  Lightbulb,
  Refrigerator,
  ScanLine
} from "lucide-react";
import { motion } from "framer-motion";

interface CameraUIProps {
  cameraActive: boolean;
  facingMode: "user" | "environment";
  countdown: number | null;
  flash: boolean;
  mode: "photo" | "barcode";
  torchActive: boolean;
  torchSupported: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClose: () => void;
  toggleCamera: () => void;
  toggleTorch: () => void;
  toggleMode: () => void;
  capturePhoto: () => void;
  captureWithCountdown: () => void;
}

// Camera viewfinder component
export const CameraViewfinder: React.FC<{
  videoRef: React.RefObject<HTMLVideoElement>;
  mode: "photo" | "barcode";
}> = ({ videoRef, mode }) => (
  <div className="relative flex-1 overflow-hidden">
    {/* Camera viewfinder */}
    <video 
      ref={videoRef} 
      className="absolute inset-0 w-full h-full object-cover" 
      autoPlay 
      playsInline 
      muted
    />
    
    {/* Focus frame */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full border-[40px] border-black/50 box-border"></div>
      
      {/* Mode-specific guide overlay */}
      {mode === "barcode" ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-24 border-2 border-white rounded-lg flex items-center justify-center">
            <ScanLine className="h-16 w-full text-white/80 animate-pulse" />
          </div>
          <div className="absolute bottom-40 text-white text-center text-sm px-4 py-2 bg-black/50 rounded-full">
            Align barcode within the frame and hold steady
          </div>
          
          {/* Animated scanner line */}
          <motion.div 
            className="absolute w-4/5 h-0.5 bg-fridge-400"
            initial={{ top: "40%" }}
            animate={{ top: "60%" }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              ease: "linear"
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-4/5 border-2 border-white/60 rounded-lg flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,2 L2,2 L2,10" stroke="white" strokeWidth="3" />
                <path d="M90,2 L98,2 L98,10" stroke="white" strokeWidth="3" />
                <path d="M10,98 L2,98 L2,90" stroke="white" strokeWidth="3" />
                <path d="M90,98 L98,98 L98,90" stroke="white" strokeWidth="3" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-40 text-white text-center text-sm px-4 py-2 bg-black/50 rounded-full">
            Position food items clearly in the frame
          </div>
        </div>
      )}
      
      {/* Helper tooltip */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm py-2 px-4 rounded-full flex items-center">
        <Refrigerator className="h-4 w-4 mr-2 text-fridge-400" />
        <span>
          {mode === "photo" 
            ? "Capture all visible items for best results" 
            : "Scan product barcode to add to inventory"
          }
        </span>
      </div>
    </div>
  </div>
);

// Mode selector component
export const CameraModeSelector: React.FC<{
  mode: "photo" | "barcode";
  toggleMode: () => void;
}> = ({ mode, toggleMode }) => (
  <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex bg-black/60 rounded-full p-1 z-10">
    <Button
      onClick={toggleMode}
      variant={mode === "photo" ? "default" : "ghost"}
      size="sm"
      className={`rounded-full px-4 flex items-center gap-2 ${
        mode === "photo" ? "bg-fridge-600 text-white" : "text-white/70"
      }`}
    >
      <CameraIcon className="h-4 w-4" />
      <span className="text-xs font-medium">Food</span>
    </Button>
    <Button
      onClick={toggleMode}
      variant={mode === "barcode" ? "default" : "ghost"}
      size="sm"
      className={`rounded-full px-4 flex items-center gap-2 ${
        mode === "barcode" ? "bg-fridge-600 text-white" : "text-white/70"
      }`}
    >
      <Barcode className="h-4 w-4" />
      <span className="text-xs font-medium">Barcode</span>
    </Button>
  </div>
);

// Camera controls component
export const CameraControls: React.FC<{
  facingMode: "user" | "environment";
  torchActive: boolean;
  torchSupported: boolean;
  mode: "photo" | "barcode";
  countdown: number | null;
  onClose: () => void;
  toggleCamera: () => void;
  toggleTorch: () => void;
}> = ({ 
  facingMode, 
  torchActive, 
  torchSupported, 
  countdown, 
  onClose, 
  toggleCamera, 
  toggleTorch 
}) => (
  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
    <Button 
      onClick={onClose} 
      variant="ghost" 
      size="icon" 
      className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full h-12 w-12"
    >
      <XCircle className="h-8 w-8" />
    </Button>
    
    <div className="flex space-x-2">
      <Button
        onClick={toggleCamera}
        variant="ghost"
        size="icon"
        className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full h-12 w-12"
        disabled={countdown !== null}
      >
        <FlipHorizontal className="h-6 w-6" />
      </Button>
      
      {facingMode === "environment" && (
        <Button
          onClick={toggleTorch}
          variant="ghost"
          size="icon"
          className={`${torchActive ? 'bg-yellow-500/70' : 'bg-black/20'} text-white hover:bg-black/40 backdrop-blur-md rounded-full h-12 w-12`}
          disabled={countdown !== null || !torchSupported}
        >
          <Lightbulb className="h-6 w-6" />
        </Button>
      )}
    </div>
  </div>
);

// Capture button component
export const CaptureButton: React.FC<{
  mode: "photo" | "barcode";
  cameraActive: boolean;
  countdown: number | null;
  captureWithCountdown: () => void;
  capturePhoto: () => void;
}> = ({ 
  mode, 
  cameraActive, 
  countdown, 
  captureWithCountdown, 
  capturePhoto 
}) => (
  <div className="bg-black/80 p-6 flex justify-center items-center backdrop-blur-md">
    <div className="flex-1 flex justify-center">
      <Button 
        onClick={mode === "photo" ? captureWithCountdown : capturePhoto} 
        variant="ghost" 
        size="icon" 
        className="bg-white h-16 w-16 rounded-full hover:bg-gray-200 shadow-lg relative"
        disabled={!cameraActive || countdown !== null}
      >
        {mode === "photo" ? (
          <CameraIcon className="h-8 w-8 text-black" />
        ) : (
          <Barcode className="h-8 w-8 text-black" />
        )}
        {/* Pulsing ring for active state */}
        <span className="absolute -inset-1 rounded-full border-2 border-white/30 animate-ping" />
      </Button>
    </div>
  </div>
);

// Flash and countdown overlays
export const CameraOverlays: React.FC<{
  flash: boolean;
  countdown: number | null;
}> = ({ flash, countdown }) => (
  <>
    {/* Flash overlay */}
    {flash && (
      <div className="absolute inset-0 bg-white z-10 animate-fade-out"></div>
    )}
    
    {/* Countdown display */}
    {countdown && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
        <motion.div 
          key={countdown}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="text-white text-9xl font-bold"
        >
          {countdown}
        </motion.div>
      </div>
    )}
  </>
);

// Main CameraUI component that combines all parts
const CameraUI: React.FC<CameraUIProps> = ({
  cameraActive,
  facingMode,
  countdown,
  flash,
  mode,
  torchActive,
  torchSupported,
  videoRef,
  canvasRef,
  onClose,
  toggleCamera,
  toggleTorch,
  toggleMode,
  capturePhoto,
  captureWithCountdown
}) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex flex-col" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Viewfinder area */}
      <CameraViewfinder videoRef={videoRef} mode={mode} />
      
      {/* Controls at the top */}
      <CameraControls 
        facingMode={facingMode}
        torchActive={torchActive}
        torchSupported={torchSupported}
        mode={mode}
        countdown={countdown}
        onClose={onClose}
        toggleMode={toggleMode}
        toggleCamera={toggleCamera}
        toggleTorch={toggleTorch}
      />
      
      {/* Canvas for capturing photos (hidden) */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Mode selector */}
      <CameraModeSelector mode={mode} toggleMode={toggleMode} />
      
      {/* Flash and countdown overlays */}
      <CameraOverlays flash={flash} countdown={countdown} />
      
      {/* Capture button at the bottom */}
      <CaptureButton 
        mode={mode}
        cameraActive={cameraActive}
        countdown={countdown}
        captureWithCountdown={captureWithCountdown}
        capturePhoto={capturePhoto}
      />
    </motion.div>
  );
};

export default CameraUI;
