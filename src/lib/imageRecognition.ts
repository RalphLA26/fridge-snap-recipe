export interface IngredientDetectionResult {
  ingredients: string[];
  confidenceScores: number[];
}

export const detectIngredientsFromImage = (imageData: string): Promise<IngredientDetectionResult> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock detected ingredients with confidence scores
      const mockResult: IngredientDetectionResult = {
        ingredients: [
          "tomatoes",
          "lettuce",
          "onion",
          "chicken",
          "bell pepper",
          "cucumber",
          "carrots",
          "potatoes",
        ],
        confidenceScores: [
          0.95,
          0.92,
          0.89,
          0.85,
          0.81,
          0.78,
          0.75,
          0.72,
        ],
      };
      
      resolve(mockResult);
    }, 2000);
  });
};
