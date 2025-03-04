
// This is a simulated AI-based ingredient recognition system
// In a production app, this would use a real computer vision API like TensorFlow.js or Google Cloud Vision

// Map of common food items with their visual characteristics and nutritional categories
const foodItemsDatabase = [
  { name: "apple", characteristics: ["round", "red", "green", "fruit"], category: "fruit" },
  { name: "banana", characteristics: ["yellow", "curved", "fruit"], category: "fruit" },
  { name: "orange", characteristics: ["round", "orange", "fruit"], category: "fruit" },
  { name: "tomato", characteristics: ["round", "red", "vegetable"], category: "vegetable" },
  { name: "cucumber", characteristics: ["long", "green", "vegetable"], category: "vegetable" },
  { name: "carrot", characteristics: ["orange", "long", "vegetable"], category: "vegetable" },
  { name: "broccoli", characteristics: ["green", "tree-like", "vegetable"], category: "vegetable" },
  { name: "chicken", characteristics: ["meat", "white", "protein"], category: "protein" },
  { name: "beef", characteristics: ["meat", "red", "protein"], category: "protein" },
  { name: "milk", characteristics: ["white", "liquid", "dairy"], category: "dairy" },
  { name: "cheese", characteristics: ["yellow", "dairy", "solid"], category: "dairy" },
  { name: "yogurt", characteristics: ["white", "dairy", "creamy"], category: "dairy" },
  { name: "eggs", characteristics: ["oval", "white", "protein"], category: "protein" },
  { name: "bread", characteristics: ["brown", "baked", "grain"], category: "grain" },
  { name: "rice", characteristics: ["white", "grain", "small"], category: "grain" },
  { name: "pasta", characteristics: ["yellow", "grain", "long"], category: "grain" },
  { name: "onion", characteristics: ["round", "layered", "vegetable"], category: "vegetable" },
  { name: "garlic", characteristics: ["white", "small", "aromatic"], category: "vegetable" },
  { name: "potato", characteristics: ["brown", "round", "vegetable"], category: "vegetable" },
  { name: "bell pepper", characteristics: ["red", "green", "yellow", "vegetable"], category: "vegetable" },
  { name: "lettuce", characteristics: ["green", "leafy", "vegetable"], category: "vegetable" },
  { name: "spinach", characteristics: ["green", "leafy", "vegetable"], category: "vegetable" },
  { name: "butter", characteristics: ["yellow", "dairy", "fat"], category: "dairy" },
  { name: "oil", characteristics: ["yellow", "liquid", "fat"], category: "condiment" },
  { name: "avocado", characteristics: ["green", "oval", "creamy", "fruit"], category: "fruit" },
  { name: "lemon", characteristics: ["yellow", "citrus", "round", "fruit"], category: "fruit" },
  { name: "lime", characteristics: ["green", "citrus", "round", "fruit"], category: "fruit" },
  { name: "salmon", characteristics: ["pink", "fish", "protein"], category: "protein" },
  { name: "tuna", characteristics: ["red", "fish", "protein"], category: "protein" },
  { name: "bacon", characteristics: ["red", "white", "strips", "meat"], category: "protein" },
  { name: "ham", characteristics: ["pink", "meat", "slice"], category: "protein" },
  { name: "mushroom", characteristics: ["brown", "beige", "fungus"], category: "vegetable" },
  { name: "tofu", characteristics: ["white", "block", "protein"], category: "protein" },
  { name: "blueberries", characteristics: ["blue", "small", "round", "fruit"], category: "fruit" },
  { name: "strawberries", characteristics: ["red", "fruit", "seeds"], category: "fruit" },
  { name: "grapes", characteristics: ["green", "purple", "cluster", "fruit"], category: "fruit" },
  // Adding more items for better recognition
  { name: "kiwi", characteristics: ["green", "brown", "fuzzy", "fruit"], category: "fruit" },
  { name: "pineapple", characteristics: ["yellow", "spiky", "tropical", "fruit"], category: "fruit" },
  { name: "watermelon", characteristics: ["green", "red", "large", "fruit"], category: "fruit" },
  { name: "zucchini", characteristics: ["green", "long", "vegetable"], category: "vegetable" },
  { name: "eggplant", characteristics: ["purple", "oval", "vegetable"], category: "vegetable" },
  { name: "cabbage", characteristics: ["green", "leafy", "round", "vegetable"], category: "vegetable" },
  { name: "peas", characteristics: ["green", "small", "round", "vegetable"], category: "vegetable" },
  { name: "beans", characteristics: ["green", "long", "vegetable"], category: "vegetable" },
  { name: "corn", characteristics: ["yellow", "grain", "vegetable"], category: "vegetable" },
  { name: "pork", characteristics: ["pink", "meat", "protein"], category: "protein" },
  { name: "turkey", characteristics: ["white", "meat", "protein"], category: "protein" },
  { name: "lamb", characteristics: ["red", "meat", "protein"], category: "protein" },
  { name: "shrimp", characteristics: ["pink", "seafood", "protein"], category: "protein" },
  { name: "crab", characteristics: ["red", "seafood", "protein"], category: "protein" },
  { name: "fish", characteristics: ["white", "seafood", "protein"], category: "protein" }
];

// Improved image analysis with better pattern matching
const analyzeImage = (imageData: string): string[] => {
  // In a production app, we would analyze the actual image data
  // For this demo, we'll return a more consistent selection of items
  
  // Use the hash of the image data to seed our selection pattern
  const imageHash = imageData.length % 100;
  
  // Group items by category to ensure diverse results
  const categorizedItems = foodItemsDatabase.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof foodItemsDatabase>);
  
  // Select items from different categories for a more realistic detection
  const detectedItems: string[] = [];
  
  // Use the image hash to determine how many items from each category
  const categories = Object.keys(categorizedItems);
  const categoryCount = Math.max(2, Math.min(4, Math.floor(imageHash / 20)));
  
  // Select random categories based on hash
  const selectedCategories = categories
    .sort(() => (imageHash * 0.42) - 0.5)
    .slice(0, categoryCount);
  
  // For each selected category, pick 1-3 items
  selectedCategories.forEach(category => {
    const items = categorizedItems[category];
    const itemCount = 1 + Math.floor((imageHash % 3));
    
    // Sort deterministically based on hash for consistent results
    const categoryItems = [...items]
      .sort(() => (imageHash * 0.37) - 0.5)
      .slice(0, itemCount)
      .map(item => item.name);
    
    detectedItems.push(...categoryItems);
  });
  
  // Ensure we have at least 5 items for a better user experience
  if (detectedItems.length < 5) {
    // Add random items from any category until we reach 5
    const allItemNames = foodItemsDatabase.map(item => item.name);
    const remainingItems = allItemNames.filter(name => !detectedItems.includes(name));
    
    while (detectedItems.length < 5 && remainingItems.length > 0) {
      const randomIndex = (imageHash * detectedItems.length) % remainingItems.length;
      detectedItems.push(remainingItems[randomIndex]);
      remainingItems.splice(randomIndex, 1);
    }
  }
  
  return detectedItems;
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
