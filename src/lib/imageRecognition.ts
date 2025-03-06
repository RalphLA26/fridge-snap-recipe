
// Define interfaces for ingredient detection
export interface IngredientDetectionResult {
  ingredients: string[];
  confidenceScores: number[];
}

/**
 * Simulates detecting ingredients from an image
 * In a real app, this would call a machine learning API
 */
export async function detectIngredientsFromImage(imageBase64: string): Promise<IngredientDetectionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock detection results
  // In a real app, this would be the response from an ML model
  const detectedIngredients = [
    "tomatoes",
    "cheese",
    "lettuce",
    "onions",
    "chicken",
    "bell peppers"
  ];
  
  // Generate random confidence scores between 0.7 and 0.98
  const confidenceScores = detectedIngredients.map(() => 
    Math.round((0.7 + Math.random() * 0.28) * 100) / 100
  );
  
  // Sort by confidence score (highest first)
  const sortedIndexes = confidenceScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.index);
  
  return {
    ingredients: sortedIndexes.map(index => detectedIngredients[index]),
    confidenceScores: sortedIndexes.map(index => confidenceScores[index])
  };
}
