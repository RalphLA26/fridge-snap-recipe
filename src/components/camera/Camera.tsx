
import React, { memo } from "react";
import useCameraControl from "./useCameraControl";
import CameraUI from "./CameraUI";
import { CameraProps } from "./types";
import { Loader2, Camera as CameraIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const {
    videoRef,
    canvasRef,
    cameraActive,
    facingMode,
    countdown,
    flash,
    mode,
    torchActive,
    torchSupported,
    isLoading,
    toggleCamera,
    toggleTorch,
    toggleMode,
    captureWithCountdown,
    capturePhoto
  } = useCameraControl(onCapture);

  // Show loading state while camera is initializing
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
        <p className="text-white text-lg text-center">Initializing camera...</p>
        <p className="text-gray-400 text-sm mt-2 text-center">Please allow camera permissions if prompted</p>
      </div>
    );
  }
  
  // Show error message if camera failed to activate after loading
  if (!isLoading && !cameraActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-white text-xl mb-2 text-center">Camera Not Available</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          We couldn't access your camera. Please check your device permissions and try again.
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <Button 
            onClick={toggleCamera} 
            className="w-full bg-fridge-600 hover:bg-fridge-700"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Try Front Camera
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
  }

  return (
    <CameraUI
      cameraActive={cameraActive}
      facingMode={facingMode}
      countdown={countdown}
      flash={flash}
      mode={mode}
      torchActive={torchActive}
      torchSupported={torchSupported}
      videoRef={videoRef}
      canvasRef={canvasRef}
      onClose={onClose}
      toggleCamera={toggleCamera}
      toggleTorch={toggleTorch}
      toggleMode={toggleMode}
      captureWithCountdown={captureWithCountdown}
      capturePhoto={capturePhoto}
    />
  );
};

export default memo(Camera);
