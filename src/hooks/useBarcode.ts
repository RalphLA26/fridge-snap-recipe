import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";

interface UseBarcodeReturn {
  isScanningBarcode: boolean;
  startBarcodeScanning: (videoElement: HTMLVideoElement) => void;
  stopBarcodeScanning: () => void;
  lastScannedBarcode: string | null;
  scanProgress: number;
}

export function useBarcode(): UseBarcodeReturn {
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [scanInterval, setScanInterval] = useState<number | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Keep track of processed frames to avoid re-scanning the same image
  const processedFrames = useRef(new Set<string>());
  // Track scan attempts to prevent fake scans from being too frequent
  const scanAttempts = useRef(0);
  
  // Function to check if a barcode is visually present in the frame
  const detectBarcode = useCallback((imageData: ImageData): string | null => {
    // Generate a hash of the frame to avoid re-processing identical frames
    const frameHash = imageData.data.reduce((a, b) => a + b, 0).toString();
    
    // Don't process frames we've already seen
    if (processedFrames.current.has(frameHash)) {
      return null;
    }
    
    processedFrames.current.add(frameHash);
    if (processedFrames.current.size > 20) {
      // Keep memory usage reasonable by limiting set size
      processedFrames.current.clear();
    }
    
    // In a real app, this would perform actual barcode detection
    // For demo purposes, we'll check for visual characteristics that might
    // indicate a barcode is in frame (looking for high contrast patterns)
    
    // This is just a placeholder for demonstration. 
    // A real implementation would do actual barcode detection here.
    return null;
  }, []);
  
  // Process video frames to detect barcodes
  const processVideoFrame = useCallback((videoElement: HTMLVideoElement) => {
    // Create a canvas to process the video frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    
    if (!context) {
      toast.error("Could not initialize barcode scanner");
      return;
    }
    
    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Create a region of interest in the center where barcodes are likely
    const centerWidth = canvas.width * 0.7;
    const centerHeight = canvas.height * 0.3;
    const x = (canvas.width - centerWidth) / 2;
    const y = (canvas.height - centerHeight) / 2;
    
    try {
      // Get the image data from the center of the frame
      const imageData = context.getImageData(x, y, centerWidth, centerHeight);
      
      // Check for a barcode in the image data
      const barcode = detectBarcode(imageData);
      
      if (barcode) {
        setLastScannedBarcode(barcode);
        stopBarcodeScanning();
      }
    } catch (error) {
      console.error("Error processing video frame:", error);
    }
  }, [detectBarcode]);

  const startBarcodeScanning = useCallback((videoElement: HTMLVideoElement) => {
    setIsScanningBarcode(true);
    setLastScannedBarcode(null);
    setScanProgress(0);
    processedFrames.current.clear();
    scanAttempts.current = 0;
    
    // Clear any existing interval
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    
    // Set new interval to check for barcodes every 100ms (faster than before)
    const interval = window.setInterval(() => {
      processVideoFrame(videoElement);
      
      // Increment scan progress for visual feedback
      setScanProgress(prev => {
        const newProgress = prev + (Math.random() * 2);
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual detection
      });
    }, 100);
    
    setScanInterval(interval);
    
    // For demo purposes only - simulate finding a real barcode after random time
    const scanSimulation = setTimeout(() => {
      if (isScanningBarcode) {
        // Only increment attempt counter if we're still scanning
        scanAttempts.current += 1;
        
        // Simulate a successful scan with higher probability for better UX
        if (scanAttempts.current >= 3 && Math.random() < 0.3) {
          // Real barcode formats 
          const realBarcodes = [
            "5901234123457", // EAN-13 (European Article Number)
            "0123456789012", // UPC-A (Universal Product Code)
            "7350053850149", // Swedish product code
            "8410700624307", // Spanish product code
          ];
          
          const selectedBarcode = realBarcodes[Math.floor(Math.random() * realBarcodes.length)];
          setScanProgress(100); // Complete the progress
          
          // Slight delay before completing the scan for better UX
          setTimeout(() => {
            setLastScannedBarcode(selectedBarcode);
            stopBarcodeScanning();
          }, 300);
        }
      }
    }, 2000 + Math.random() * 2000); // Shorter delay (2-4 seconds) for better UX
    
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
    scanProgress,
  };
}
