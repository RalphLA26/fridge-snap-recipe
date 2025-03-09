
import React, { memo } from "react";
import useCameraControl from "./useCameraControl";
import CameraUI from "./CameraUI";
import { CameraProps } from "./types";
import { Loader2 } from "lucide-react";

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
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
        <p className="text-white text-lg">Initializing camera...</p>
        <p className="text-gray-400 text-sm mt-2">Please allow camera permissions if prompted</p>
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
