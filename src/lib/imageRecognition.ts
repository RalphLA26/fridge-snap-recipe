
export interface IngredientDetectionResult {
  ingredients: string[];
  confidenceScores: number[];
}

export const detectIngredientsFromImage = (imageData: string): Promise<IngredientDetectionResult> => {
  return new Promise((resolve, reject) => {
    // Verify that image data is valid
    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image')) {
      reject(new Error('Invalid image data provided'));
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      try {
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
      } catch (error) {
        reject(new Error('Failed to process image data'));
      }
    }, 2000);
  });
};
