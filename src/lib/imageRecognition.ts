
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
        // Enhanced list of mock detected ingredients with confidence scores
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
            "broccoli",
            "spinach",
            "garlic",
            "avocado",
            "mushrooms",
            "zucchini",
            "eggs",
            "cheese",
            "beef",
            "salmon",
            "rice",
            "pasta",
          ],
          confidenceScores: [
            0.96,
            0.94,
            0.92,
            0.90,
            0.88,
            0.86,
            0.84,
            0.82,
            0.80,
            0.78,
            0.76,
            0.74,
            0.72,
            0.70,
            0.68,
            0.66,
            0.64,
            0.62,
            0.60,
            0.58,
          ],
        };
        
        // Randomly select between 3-8 ingredients to mimic real detection behavior
        const numIngredients = Math.floor(Math.random() * 6) + 3; // 3 to 8 items
        const selectedIngredients: string[] = [];
        const selectedScores: number[] = [];
        
        // Create a copy of arrays to manipulate
        const ingredientsCopy = [...mockResult.ingredients];
        const scoresCopy = [...mockResult.confidenceScores];
        
        // Randomly select ingredients
        for (let i = 0; i < numIngredients; i++) {
          if (ingredientsCopy.length === 0) break;
          
          const randomIndex = Math.floor(Math.random() * ingredientsCopy.length);
          selectedIngredients.push(ingredientsCopy[randomIndex]);
          selectedScores.push(scoresCopy[randomIndex]);
          
          // Remove selected ingredient
          ingredientsCopy.splice(randomIndex, 1);
          scoresCopy.splice(randomIndex, 1);
        }
        
        resolve({
          ingredients: selectedIngredients,
          confidenceScores: selectedScores
        });
      } catch (error) {
        reject(new Error('Failed to process image data'));
      }
    }, 2000);
  });
};
