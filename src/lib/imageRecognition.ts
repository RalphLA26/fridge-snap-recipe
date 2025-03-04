
// This is a simulated AI-based ingredient recognition system
// In a production app, this would use a real computer vision API like TensorFlow.js or Google Cloud Vision

// Map of common food items with their visual characteristics
const foodItemsDatabase = [
  { name: "apple", characteristics: ["round", "red", "green", "fruit"] },
  { name: "banana", characteristics: ["yellow", "curved", "fruit"] },
  { name: "orange", characteristics: ["round", "orange", "fruit"] },
  { name: "tomato", characteristics: ["round", "red", "vegetable"] },
  { name: "cucumber", characteristics: ["long", "green", "vegetable"] },
  { name: "carrot", characteristics: ["orange", "long", "vegetable"] },
  { name: "broccoli", characteristics: ["green", "tree-like", "vegetable"] },
  { name: "chicken", characteristics: ["meat", "white", "protein"] },
  { name: "beef", characteristics: ["meat", "red", "protein"] },
  { name: "milk", characteristics: ["white", "liquid", "dairy"] },
  { name: "cheese", characteristics: ["yellow", "dairy", "solid"] },
  { name: "yogurt", characteristics: ["white", "dairy", "creamy"] },
  { name: "eggs", characteristics: ["oval", "white", "protein"] },
  { name: "bread", characteristics: ["brown", "baked", "grain"] },
  { name: "rice", characteristics: ["white", "grain", "small"] },
  { name: "pasta", characteristics: ["yellow", "grain", "long"] },
  { name: "onion", characteristics: ["round", "layered", "vegetable"] },
  { name: "garlic", characteristics: ["white", "small", "aromatic"] },
  { name: "potato", characteristics: ["brown", "round", "vegetable"] },
  { name: "bell pepper", characteristics: ["red", "green", "yellow", "vegetable"] },
  { name: "lettuce", characteristics: ["green", "leafy", "vegetable"] },
  { name: "spinach", characteristics: ["green", "leafy", "vegetable"] },
  { name: "butter", characteristics: ["yellow", "dairy", "fat"] },
  { name: "oil", characteristics: ["yellow", "liquid", "fat"] },
  { name: "avocado", characteristics: ["green", "oval", "creamy", "fruit"] },
  { name: "lemon", characteristics: ["yellow", "citrus", "round", "fruit"] },
  { name: "lime", characteristics: ["green", "citrus", "round", "fruit"] },
  { name: "salmon", characteristics: ["pink", "fish", "protein"] },
  { name: "tuna", characteristics: ["red", "fish", "protein"] },
  { name: "bacon", characteristics: ["red", "white", "strips", "meat"] },
  { name: "ham", characteristics: ["pink", "meat", "slice"] },
  { name: "mushroom", characteristics: ["brown", "beige", "fungus"] },
  { name: "tofu", characteristics: ["white", "block", "protein"] },
  { name: "blueberries", characteristics: ["blue", "small", "round", "fruit"] },
  { name: "strawberries", characteristics: ["red", "fruit", "seeds"] },
  { name: "grapes", characteristics: ["green", "purple", "cluster", "fruit"] }
];

// Simulated image analysis that would normally be done by a real ML model
const analyzeImage = (imageData: string): string[] => {
  // In a production app, we would analyze the actual image data
  // For this demo, we'll return 4-7 random items
  
  // Use the hash of the image data to seed our "random" selection
  // This makes the same image produce the same results (for demo consistency)
  const imageHash = imageData.length % 100;
  
  // Select 4-7 random items based on the "hash"
  const minItems = 4;
  const maxItems = 7;
  const detectedCount = minItems + (imageHash % (maxItems - minItems + 1));
  
  // Get unique items by shuffling the database and taking the first N
  const shuffledItems = [...foodItemsDatabase]
    .sort(() => (imageHash * 0.3) - 0.5) // Deterministic shuffle based on hash
    .slice(0, detectedCount);
  
  return shuffledItems.map(item => item.name);
};

export const detectIngredientsFromImage = async (imageData: string): Promise<string[]> => {
  return new Promise((resolve) => {
    // Simulate API delay (1.5-2.5 seconds)
    const processingTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const detectedIngredients = analyzeImage(imageData);
      resolve(detectedIngredients);
    }, processingTime);
  });
};
