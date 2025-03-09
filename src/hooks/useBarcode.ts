
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseBarcodeReturn {
  isScanningBarcode: boolean;
  startBarcodeScanning: (videoElement: HTMLVideoElement) => void;
  stopBarcodeScanning: () => void;
  lastScannedBarcode: string | null;
}

// Simplified barcode scanner - in a real app, you would use a proper
// barcode scanning library like @zxing/library or QuaggaJS
export function useBarcode(): UseBarcodeReturn {
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [scanInterval, setScanInterval] = useState<number | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);

  // Mock function to simulate barcode scanning
  // In a real app, this would use a proper barcode scanning library
  const simulateBarcodeDetection = useCallback((videoElement: HTMLVideoElement) => {
    // Create a canvas to process the video frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      toast.error("Could not initialize barcode scanner");
      return;
    }
    
    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // In a real app, this is where you would process the image to detect barcodes
    // For demo purposes, we'll just simulate finding a barcode ~20% of the time
    if (Math.random() < 0.2) {
      const mockBarcodes = [
        "5901234123457", // EAN-13 (European Article Number)
        "0123456789012", // UPC-A (Universal Product Code)
        "9781234567897", // ISBN (International Standard Book Number)
        "2345678901234", // Random digit sequence
      ];
      
      const mockBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      setLastScannedBarcode(mockBarcode);
      toast.success(`Barcode detected: ${mockBarcode}`);
      
      // Stop scanning after successful detection
      stopBarcodeScanning();
    }
  }, []);

  const startBarcodeScanning = useCallback((videoElement: HTMLVideoElement) => {
    setIsScanningBarcode(true);
    toast.info("Scanning for barcodes. Hold steady...", {
      duration: 2000,
    });
    
    // Clear any existing interval
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    
    // Set new interval to check for barcodes every 500ms
    const interval = window.setInterval(() => {
      simulateBarcodeDetection(videoElement);
    }, 500);
    
    setScanInterval(interval);
  }, [scanInterval, simulateBarcodeDetection]);

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
