
import React, { memo } from "react";
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
    toggleCamera,
    toggleTorch,
    toggleMode,
    captureWithCountdown,
    capturePhoto
  } = useCameraControl(onCapture);

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
