
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
    const fractionMap: Record<number, string> = {
      0.25: '1/4',
      0.33: '1/3',
      0.5: '1/2',
      0.67: '2/3',
      0.75: '3/4'
    };
    
    // Find the closest fraction representation
    const decimal = Math.round(ingredient.quantity * 100) / 100;
    const closest = Object.entries(fractionMap).reduce((prev, [value, fraction]) => {
      return Math.abs(parseFloat(value) - decimal) < Math.abs(prev[0] - decimal)
        ? [parseFloat(value), fraction]
        : prev;
    }, [99, '']);
    
    if (Math.abs(closest[0] - decimal) < 0.05) {
      quantityStr = closest[1];
    } else {
      // If no close fraction, use decimal with one decimal place
      quantityStr = decimal.toFixed(1).replace(/\.0$/, '');
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
