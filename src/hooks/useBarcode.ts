
import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";

interface UseBarcodeReturn {
  isScanningBarcode: boolean;
  startBarcodeScanning: (videoElement: HTMLVideoElement) => void;
  stopBarcodeScanning: () => void;
  lastScannedBarcode: string | null;
}

export function useBarcode(): UseBarcodeReturn {
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [scanInterval, setScanInterval] = useState<number | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  
  // Track scan attempts to prevent fake scans from being too frequent
  const scanAttempts = useRef(0);
  
  // Process video frames to detect barcodes
  const processVideoFrame = useCallback((videoElement: HTMLVideoElement) => {
    // In a real implementation, this would analyze the video frame for barcodes
    // For demo purposes, we're simulating barcode detection
    console.log("Processing video frame for barcode");
  }, []);

  const startBarcodeScanning = useCallback((videoElement: HTMLVideoElement) => {
    setIsScanningBarcode(true);
    setLastScannedBarcode(null);
    
    // Clear any existing interval
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    
    // Set new interval to check for barcodes
    const interval = window.setInterval(() => {
      processVideoFrame(videoElement);
    }, 200);
    
    setScanInterval(interval);
    
    // For demo purposes only - simulate finding a barcode after a few seconds
    const scanSimulation = setTimeout(() => {
      if (isScanningBarcode) {
        scanAttempts.current += 1;
        
        // Simulate successful scan after a couple of attempts
        if (scanAttempts.current >= 2) {
          // Real barcode formats 
          const realBarcodes = [
            "5901234123457", // EAN-13
            "0123456789012", // UPC-A
            "7350053850149", // Swedish product
            "8410700624307", // Spanish product
          ];
          
          const selectedBarcode = realBarcodes[Math.floor(Math.random() * realBarcodes.length)];
          
          setLastScannedBarcode(selectedBarcode);
          stopBarcodeScanning();
          toast.success("Barcode detected!");
        }
      }
    }, 2000 + Math.random() * 1000);
    
    // Remember to clear the timeout on cleanup
    return () => clearTimeout(scanSimulation);
  }, [scanInterval, processVideoFrame, isScanningBarcode]);

  const stopBarcodeScanning = useCallback(() => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    setIsScanningBarcode(false);
  }, [scanInterval]);

  return {
    isScanningBarcode,
    startBarcodeScanning,
    stopBarcodeScanning,
    lastScannedBarcode,
  };
}
