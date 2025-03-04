
type IngredientPart = {
  quantity: number;
  unit: string | null;
  name: string;
};

// Parse an ingredient string into parts (quantity, unit, name)
export const parseIngredient = (ingredientString: string): IngredientPart => {
  // Regular expression to match common ingredient formats
  const regex = /^([\d./]+)?\s*([a-zA-Z]+)?\s+(.+)$/;
  const match = ingredientString.match(regex);
  
  if (!match) {
    return {
      quantity: 1,
      unit: null,
      name: ingredientString
    };
  }
  
  const [, quantityStr, unit, name] = match;
  
  // Parse quantity (handle fractions like 1/2)
  let quantity = 1;
  if (quantityStr) {
    if (quantityStr.includes('/')) {
      const [numerator, denominator] = quantityStr.split('/');
      quantity = parseInt(numerator) / parseInt(denominator);
    } else {
      quantity = parseFloat(quantityStr);
    }
  }
  
  return {
    quantity,
    unit: unit || null,
    name: name.trim()
  };
};

// Format a scaled ingredient back to string
export const formatIngredient = (ingredient: IngredientPart): string => {
  let quantityStr = '';
  
  // Handle whole numbers and decimals differently
  if (ingredient.quantity === Math.floor(ingredient.quantity)) {
    quantityStr = ingredient.quantity.toString();
  } else {
    // Convert decimal to fraction for common values
    const fractionMap: Record<string, string> = {
      "0.25": "1/4",
      "0.33": "1/3",
      "0.5": "1/2",
      "0.67": "2/3",
      "0.75": "3/4"
    };
    
    // Find the closest fraction representation
    const decimal = Math.round(ingredient.quantity * 100) / 100;
    const decimalStr = decimal.toString();
    
    // Check if we have an exact match in our fraction map
    if (fractionMap[decimalStr]) {
      quantityStr = fractionMap[decimalStr];
    } else {
      // Find the closest match
      let closestDiff = 99;
      let closestFraction = "";
      
      Object.entries(fractionMap).forEach(([value, fraction]) => {
        const diff = Math.abs(parseFloat(value) - decimal);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestFraction = fraction;
        }
      });
      
      if (closestDiff < 0.05) {
        quantityStr = closestFraction;
      } else {
        // If no close fraction, use decimal with one decimal place
        quantityStr = decimal.toFixed(1).replace(/\.0$/, '');
      }
    }
  }
  
  return `${quantityStr}${ingredient.unit ? ' ' + ingredient.unit : ''} ${ingredient.name}`;
};

// Scale a recipe's ingredients by a given factor
export const scaleRecipe = (ingredients: string[], scaleFactor: number): string[] => {
  return ingredients.map(ingredient => {
    const parsed = parseIngredient(ingredient);
    parsed.quantity *= scaleFactor;
    return formatIngredient(parsed);
  });
};
