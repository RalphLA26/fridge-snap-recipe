
// In a real app, this would use a proper barcode scanning library
// like @zxing/library or QuaggaJS

// Mock database of product barcodes
const productDatabase: Record<string, { name: string; category: string }> = {
  "0123456789012": { name: "Organic Milk", category: "dairy" },
  "1234567890123": { name: "Free-Range Eggs", category: "protein" },
  "2345678901234": { name: "Whole Wheat Bread", category: "grain" },
  "3456789012345": { name: "Greek Yogurt", category: "dairy" },
  "4567890123456": { name: "Chicken Breast", category: "meat" },
  "5678901234567": { name: "Atlantic Salmon", category: "seafood" },
  "6789012345678": { name: "Red Bell Pepper", category: "vegetable" },
  "7890123456789": { name: "Organic Spinach", category: "vegetable" },
  "8901234567890": { name: "Cheddar Cheese", category: "dairy" },
  "9012345678901": { name: "Granny Smith Apple", category: "fruit" }
};

// Simulate barcode scanning
export const scanBarcode = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate processing time
    setTimeout(() => {
      // Generate a random barcode from our database for demo purposes
      const barcodes = Object.keys(productDatabase);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      
      if (Math.random() > 0.2) { // 80% success rate
        resolve(randomBarcode);
      } else {
        reject(new Error("Couldn't detect a barcode. Please try again."));
      }
    }, 1500);
  });
};

// Look up product by barcode
export const lookupProduct = (barcode: string): { name: string; category: string } | null => {
  return productDatabase[barcode] || null;
};
