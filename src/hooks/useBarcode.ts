
import { useCallback, useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface UseBarcodeReturn {
  isScanningBarcode: boolean;
  startBarcodeScanning: (videoElement: HTMLVideoElement) => void;
  stopBarcodeScanning: () => void;
  lastScannedBarcode: string | null;
}

export function useBarcode(): UseBarcodeReturn {
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  
  // Cleanup function to stop scanning
  const cleanupScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  }, []);
  
  // Start scanning for barcodes
  const startBarcodeScanning = useCallback((videoElement: HTMLVideoElement) => {
    setIsScanningBarcode(true);
    setLastScannedBarcode(null);
    
    // Clean up any existing intervals
    cleanupScanning();
    
    // Real barcode formats for simulation
    const realBarcodes = [
      "5901234123457", // EAN-13
      "0123456789012", // UPC-A
      "7350053850149", // Swedish product
      "8410700624307", // Spanish product
    ];
    
    // Simulate finding a barcode after a short delay
    scanTimeoutRef.current = window.setTimeout(() => {
      // Only proceed if we're still scanning
      if (isScanningBarcode) {
        // Randomly select a barcode
        const selectedBarcode = realBarcodes[Math.floor(Math.random() * realBarcodes.length)];
        setLastScannedBarcode(selectedBarcode);
      }
    }, 1500 + Math.random() * 1000); // Random delay for realism
  }, [isScanningBarcode, cleanupScanning]);

  // Stop scanning
  const stopBarcodeScanning = useCallback(() => {
    cleanupScanning();
    setIsScanningBarcode(false);
  }, [cleanupScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupScanning();
    };
  }, [cleanupScanning]);

  return {
    isScanningBarcode,
    startBarcodeScanning,
    stopBarcodeScanning,
    lastScannedBarcode,
  };
}
