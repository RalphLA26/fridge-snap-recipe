
import React, { useEffect } from "react";
import useCameraControl from "./useCameraControl";
import CameraUI from "./CameraUI";
import { CameraProps } from "./types";

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
    capturePhoto,
    startCamera
  } = useCameraControl(onCapture);

  // Initialize camera when component mounts
  useEffect(() => {
    const initCamera = async () => {
      try {
        await startCamera();
      } catch (error) {
        console.error("Failed to initialize camera:", error);
      }
    };
    
    initCamera();
    
    // Cleanup when component unmounts
    return () => {
      // Cleanup is handled in useCameraControl hook
    };
  }, [startCamera]);

  return (
    <CameraUI
      cameraActive={cameraActive}
      facingMode={facingMode}
      countdown={countdown}
      flash={flash}
      mode={mode}
      torchActive={torchActive}
      torchSupported={torchSupported}
      isLoading={isLoading}
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

export default Camera;
