
// Camera component props
export interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

// Extend MediaTrackCapabilities to include torch property
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

// Extend MediaTrackConstraintSet to include torch property
export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

// Camera state
export interface CameraState {
  cameraActive: boolean;
  facingMode: "user" | "environment";
  countdown: number | null;
  flash: boolean;
  mode: "photo" | "barcode";
  torchActive: boolean;
  torchSupported: boolean;
  cameraStream: MediaStream | null;
}
