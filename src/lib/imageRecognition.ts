// This is a simulated AI-based ingredient recognition system
// In a production app, this would use a real computer vision API like TensorFlow.js or Google Cloud Vision

// Define the return type explicitly
export interface IngredientDetectionResult {
  ingredients: string[];
  confidenceScores: Record<string, number>;
}

// Enhanced food items database with more detailed characteristics for better matching
const foodItemsDatabase = [
  // Fruits
  { name: "apple", characteristics: ["round", "red", "green", "fruit", "shiny", "stem"], category: "fruit", confidence: 0.9 },
  { name: "banana", characteristics: ["yellow", "curved", "fruit", "elongated", "peelable"], category: "fruit", confidence: 0.95 },
  { name: "orange", characteristics: ["round", "orange", "fruit", "textured", "citrus"], category: "fruit", confidence: 0.92 },
  { name: "grapes", characteristics: ["purple", "green", "small", "cluster", "fruit"], category: "fruit", confidence: 0.87 },
  { name: "strawberry", characteristics: ["red", "seeded", "fruit", "small", "pointed"], category: "fruit", confidence: 0.89 },
  { name: "blueberry", characteristics: ["blue", "small", "round", "fruit", "cluster"], category: "fruit", confidence: 0.84 },
  { name: "lemon", characteristics: ["yellow", "oval", "citrus", "fruit", "textured"], category: "fruit", confidence: 0.88 },
  { name: "lime", characteristics: ["green", "small", "round", "citrus", "fruit"], category: "fruit", confidence: 0.86 },
  { name: "avocado", characteristics: ["green", "pear-shaped", "fruit", "fatty", "single-seed"], category: "fruit", confidence: 0.91 },
  { name: "pineapple", characteristics: ["yellow", "spiky", "tropical", "fruit", "rough"], category: "fruit", confidence: 0.89 },
  { name: "watermelon", characteristics: ["green", "striped", "large", "fruit", "juicy", "red-inside"], category: "fruit", confidence: 0.93 },
  { name: "kiwi", characteristics: ["brown", "fuzzy", "green-inside", "fruit", "small"], category: "fruit", confidence: 0.85 },
  
  // Vegetables
  { name: "tomato", characteristics: ["red", "round", "vegetable", "smooth", "seeded"], category: "vegetable", confidence: 0.92 },
  { name: "cucumber", characteristics: ["green", "long", "vegetable", "cylindrical", "watery"], category: "vegetable", confidence: 0.9 },
  { name: "carrot", characteristics: ["orange", "long", "vegetable", "tapered", "root"], category: "vegetable", confidence: 0.94 },
  { name: "broccoli", characteristics: ["green", "tree-like", "vegetable", "florets", "dense"], category: "vegetable", confidence: 0.91 },
  { name: "lettuce", characteristics: ["green", "leafy", "vegetable", "crisp", "layered"], category: "vegetable", confidence: 0.88 },
  { name: "spinach", characteristics: ["green", "leafy", "vegetable", "flat", "small-leaves"], category: "vegetable", confidence: 0.85 },
  { name: "onion", characteristics: ["white", "round", "layered", "vegetable", "papery-skin"], category: "vegetable", confidence: 0.9 },
  { name: "garlic", characteristics: ["white", "bulb", "cloves", "vegetable", "aromatic"], category: "vegetable", confidence: 0.89 },
  { name: "potato", characteristics: ["brown", "oval", "vegetable", "starchy", "earthy"], category: "vegetable", confidence: 0.93 },
  { name: "bell pepper", characteristics: ["red", "green", "yellow", "hollow", "vegetable", "shiny"], category: "vegetable", confidence: 0.9 },
  { name: "zucchini", characteristics: ["green", "long", "vegetable", "cylindrical", "tender"], category: "vegetable", confidence: 0.87 },
  { name: "eggplant", characteristics: ["purple", "oval", "vegetable", "glossy", "spongy"], category: "vegetable", confidence: 0.86 },
  { name: "cabbage", characteristics: ["green", "purple", "round", "layered", "vegetable", "dense"], category: "vegetable", confidence: 0.89 },
  { name: "mushroom", characteristics: ["brown", "tan", "cap", "stem", "fungus", "earthy"], category: "vegetable", confidence: 0.88 },
  
  // Protein
  { name: "chicken", characteristics: ["white", "pink", "meat", "protein", "poultry"], category: "protein", confidence: 0.92 },
  { name: "beef", characteristics: ["red", "marbled", "meat", "protein", "dense"], category: "protein", confidence: 0.9 },
  { name: "pork", characteristics: ["pink", "white-fat", "meat", "protein"], category: "protein", confidence: 0.89 },
  { name: "salmon", characteristics: ["pink", "orange", "fish", "flaky", "protein", "seafood"], category: "protein", confidence: 0.91 },
  { name: "tuna", characteristics: ["red", "dense", "fish", "protein", "seafood"], category: "protein", confidence: 0.88 },
  { name: "shrimp", characteristics: ["pink", "curved", "shellfish", "protein", "seafood"], category: "protein", confidence: 0.87 },
  { name: "eggs", characteristics: ["white", "brown", "oval", "protein", "shell"], category: "protein", confidence: 0.95 },
  { name: "tofu", characteristics: ["white", "block", "soft", "protein", "bean-curd"], category: "protein", confidence: 0.85 },
  { name: "bacon", characteristics: ["pink", "striped", "fatty", "meat", "protein"], category: "protein", confidence: 0.92 },
  { name: "sausage", characteristics: ["brown", "cylindrical", "meat", "protein", "processed"], category: "protein", confidence: 0.88 },
  
  // Dairy
  { name: "milk", characteristics: ["white", "liquid", "dairy", "opaque"], category: "dairy", confidence: 0.93 },
  { name: "cheese", characteristics: ["yellow", "white", "dairy", "solid", "creamy"], category: "dairy", confidence: 0.91 },
  { name: "yogurt", characteristics: ["white", "creamy", "dairy", "container", "cultured"], category: "dairy", confidence: 0.9 },
  { name: "butter", characteristics: ["yellow", "solid", "dairy", "fatty", "block"], category: "dairy", confidence: 0.92 },
  { name: "cream", characteristics: ["white", "liquid", "dairy", "thick", "fatty"], category: "dairy", confidence: 0.88 },
  
  // Grains
  { name: "bread", characteristics: ["brown", "loaf", "grain", "baked", "sliced"], category: "grain", confidence: 0.94 },
  { name: "rice", characteristics: ["white", "brown", "small", "grain", "granular"], category: "grain", confidence: 0.92 },
  { name: "pasta", characteristics: ["yellow", "long", "grain", "dried", "shaped"], category: "grain", confidence: 0.9 },
  { name: "cereal", characteristics: ["brown", "colorful", "grain", "processed", "boxed"], category: "grain", confidence: 0.87 },
  { name: "oats", characteristics: ["tan", "flakes", "grain", "dry", "small"], category: "grain", confidence: 0.86 },
  
  // Condiments
  { name: "olive oil", characteristics: ["yellow", "green", "liquid", "oil", "bottle"], category: "condiment", confidence: 0.89 },
  { name: "ketchup", characteristics: ["red", "thick", "sauce", "bottled", "tomato-based"], category: "condiment", confidence: 0.91 },
  { name: "mustard", characteristics: ["yellow", "tangy", "sauce", "bottled", "seed-based"], category: "condiment", confidence: 0.88 },
  { name: "mayonnaise", characteristics: ["white", "creamy", "sauce", "jarred", "egg-based"], category: "condiment", confidence: 0.87 },
  { name: "soy sauce", characteristics: ["brown", "dark", "liquid", "bottled", "salty"], category: "condiment", confidence: 0.86 }
];

// Structured image analysis with pattern recognition and context awareness
const analyzeImage = (imageData: string): IngredientDetectionResult => {
  // In a real implementation, this would use computer vision APIs or ML models
  
  // Generate a consistent hash from the image data for reproducible results
  const generateImageHash = (data: string): number => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  const imageHash = generateImageHash(imageData);
  
  // Simulate detection with context awareness and relationships between items
  const simulateDetection = () => {
    // Group items by category for context-aware selection
    const categorizedItems = foodItemsDatabase.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof foodItemsDatabase>);
    
    const detectedItems: string[] = [];
    const confidenceScores: Record<string, number> = {};
    
    // Determine what categories of food might be in this image based on hash
    // More realistic simulation - fridges typically contain multiple food groups
    const categories = Object.keys(categorizedItems);
    
    // Select 3-5 categories based on the image hash
    const categoryCount = 3 + (imageHash % 3); // 3 to 5 categories
    const selectedCategories = [];
    
    // Pseudorandom but deterministic category selection
    const tempCategories = [...categories];
    for (let i = 0; i < categoryCount && tempCategories.length > 0; i++) {
      const categoryIndex = (imageHash * (i + 1)) % tempCategories.length;
      selectedCategories.push(tempCategories[categoryIndex]);
      tempCategories.splice(categoryIndex, 1);
    }
    
    // For each category, select 1-4 items with varying confidence
    selectedCategories.forEach((category, categoryIndex) => {
      const items = categorizedItems[category];
      // Different number of items per category based on hash
      const itemCount = 1 + ((imageHash * (categoryIndex + 1)) % 4); // 1 to 4 items
      
      // Sort by "confidence" to simulate more likely items being detected
      const sortedItems = [...items].sort((a, b) => {
        // Deterministic sort based on hash and item properties
        const scoreFactor = (imageHash % 100) / 100;
        const aScore = a.confidence * (1 + scoreFactor * 0.2);
        const bScore = b.confidence * (1 + scoreFactor * 0.2);
        return bScore - aScore;
      });
      
      // Select top N items
      const selectedItems = sortedItems.slice(0, itemCount);
      
      // Add to detected items with confidence scores
      selectedItems.forEach(item => {
        detectedItems.push(item.name);
        
        // Generate a slightly varied confidence score
        const baseConfidence = item.confidence;
        const varianceFactor = ((imageHash * detectedItems.length) % 20) / 100; // -0.1 to 0.1
        const adjustedConfidence = Math.min(0.99, Math.max(0.65, baseConfidence + varianceFactor));
        
        confidenceScores[item.name] = parseFloat(adjustedConfidence.toFixed(2));
      });
    });
    
    // Ensure we have at least 5 items for better user experience
    if (detectedItems.length < 5) {
      // Add random items from any category until we reach 5
      const allItems = foodItemsDatabase.filter(item => !detectedItems.includes(item.name));
      
      while (detectedItems.length < 5 && allItems.length > 0) {
        const randomIndex = (imageHash * detectedItems.length) % allItems.length;
        const selectedItem = allItems[randomIndex];
        
        detectedItems.push(selectedItem.name);
        
        // Lower confidence for these "fallback" items
        confidenceScores[selectedItem.name] = Math.max(0.65, selectedItem.confidence - 0.15);
        
        allItems.splice(randomIndex, 1);
      }
    }
    
    // Cap at a reasonable number of items (max 12)
    if (detectedItems.length > 12) {
      // Keep only the highest confidence items
      const itemsByConfidence = [...detectedItems].sort((a, b) => 
        confidenceScores[b] - confidenceScores[a]
      ).slice(0, 12);
      
      const newDetectedItems = itemsByConfidence;
      const newConfidenceScores: Record<string, number> = {};
      
      itemsByConfidence.forEach(item => {
        newConfidenceScores[item] = confidenceScores[item];
      });
      
      return { 
        detectedItems: newDetectedItems, 
        confidenceScores: newConfidenceScores 
      };
    }
    
    return { detectedItems, confidenceScores };
  };
  
  // Execute the detection simulation
  const { detectedItems, confidenceScores } = simulateDetection();
  
  return {
    ingredients: detectedItems,
    confidenceScores: confidenceScores
  };
};

export const detectIngredientsFromImage = async (imageData: string): Promise<IngredientDetectionResult> => {
  return new Promise((resolve) => {
    // Simulate API delay (1.5-2.5 seconds)
    const processingTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const detectionResult = analyzeImage(imageData);
      resolve(detectionResult);
    }, processingTime);
  });
};
