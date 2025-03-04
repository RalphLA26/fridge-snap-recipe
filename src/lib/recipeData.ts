
export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Vegetable Frittata",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1014&q=80",
    cookTime: "20 mins",
    servings: "4 servings",
    ingredients: [
      "6 large eggs",
      "1/4 cup milk",
      "1 bell pepper, diced",
      "1 small onion, diced",
      "1 cup spinach, chopped",
      "1/2 cup cheese, shredded",
      "2 tablespoons olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "In a large bowl, whisk together eggs and milk. Season with salt and pepper.",
      "Heat olive oil in an oven-safe skillet over medium heat.",
      "Add onions and cook until translucent, about 3 minutes.",
      "Add bell peppers and cook for another 2 minutes.",
      "Add spinach and cook until wilted.",
      "Pour egg mixture over the vegetables and cook for 2 minutes without stirring.",
      "Sprinkle cheese on top and transfer skillet to the oven.",
      "Bake for 10-12 minutes until eggs are set and cheese is melted.",
      "Let cool slightly before slicing and serving."
    ],
    nutrition: {
      calories: "280 kcal",
      protein: "18g",
      carbs: "5g",
      fat: "22g"
    }
  },
  {
    id: "2",
    title: "Chicken and Vegetable Stir-Fry",
    image: "https://images.unsplash.com/photo-1567982047351-76b6f93e9c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    cookTime: "25 mins",
    servings: "4 servings",
    ingredients: [
      "1 lb boneless, skinless chicken breast, sliced",
      "2 cups mixed vegetables (broccoli, carrots, snap peas)",
      "3 cloves garlic, minced",
      "1 tablespoon ginger, grated",
      "3 tablespoons soy sauce",
      "1 tablespoon honey",
      "2 tablespoons vegetable oil",
      "2 green onions, sliced",
      "Sesame seeds for garnish"
    ],
    instructions: [
      "In a small bowl, mix soy sauce and honey. Set aside.",
      "Heat 1 tablespoon of oil in a large wok or skillet over high heat.",
      "Add chicken and cook until no longer pink, about 5-6 minutes. Remove from pan.",
      "Add remaining oil, then add garlic and ginger. Cook for 30 seconds until fragrant.",
      "Add mixed vegetables and stir-fry for 3-4 minutes until crisp-tender.",
      "Return chicken to the pan and add sauce. Stir to combine and heat through.",
      "Garnish with green onions and sesame seeds before serving.",
      "Serve hot with rice or noodles if desired."
    ],
    nutrition: {
      calories: "325 kcal",
      protein: "35g",
      carbs: "12g",
      fat: "15g"
    }
  },
  {
    id: "3",
    title: "Pasta Primavera",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    cookTime: "30 mins",
    servings: "4 servings",
    ingredients: [
      "8 oz pasta (fettuccine or penne)",
      "2 cups mixed vegetables (zucchini, carrots, peas)",
      "1 small onion, diced",
      "2 cloves garlic, minced",
      "1/4 cup parmesan cheese, grated",
      "2 tablespoons olive oil",
      "1/4 cup heavy cream",
      "1/4 cup pasta water",
      "Fresh basil for garnish",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook pasta according to package instructions. Reserve 1/4 cup of pasta water before draining.",
      "In a large skillet, heat olive oil over medium heat.",
      "Add onions and cook until translucent, about 3 minutes.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Add vegetables and cook for 5-7 minutes until tender.",
      "Reduce heat and add heavy cream, pasta water, and parmesan cheese. Stir until combined.",
      "Add cooked pasta to the skillet and toss to coat with sauce.",
      "Season with salt and pepper to taste.",
      "Garnish with fresh basil before serving."
    ],
    nutrition: {
      calories: "380 kcal",
      protein: "12g",
      carbs: "45g",
      fat: "18g"
    }
  },
  {
    id: "4",
    title: "Quick Mediterranean Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80",
    cookTime: "15 mins",
    servings: "2 servings",
    ingredients: [
      "2 cups mixed greens",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, thinly sliced",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup kalamata olives",
      "2 tablespoons olive oil",
      "1 tablespoon lemon juice",
      "1 teaspoon dried oregano",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a large bowl, combine mixed greens, cucumber, tomatoes, red onion, feta cheese, and olives.",
      "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
      "Pour dressing over the salad and toss gently to combine.",
      "Serve immediately as a light meal or side dish."
    ],
    nutrition: {
      calories: "220 kcal",
      protein: "6g",
      carbs: "8g",
      fat: "18g"
    }
  },
  {
    id: "5",
    title: "Creamy Tomato Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    cookTime: "35 mins",
    servings: "4 servings",
    ingredients: [
      "2 tablespoons butter",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "2 tablespoons flour",
      "2 cans (14.5 oz each) diced tomatoes",
      "2 cups vegetable broth",
      "1/2 cup heavy cream",
      "1 teaspoon dried basil",
      "1 teaspoon sugar",
      "Salt and pepper to taste",
      "Fresh basil for garnish"
    ],
    instructions: [
      "In a large pot, melt butter over medium heat.",
      "Add onions and cook until softened, about 5 minutes.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Stir in flour and cook for 1 minute.",
      "Add diced tomatoes, vegetable broth, dried basil, and sugar. Bring to a boil.",
      "Reduce heat and simmer for 15 minutes.",
      "Use an immersion blender to puree the soup until smooth.",
      "Stir in heavy cream and heat through.",
      "Season with salt and pepper to taste.",
      "Garnish with fresh basil before serving."
    ],
    nutrition: {
      calories: "210 kcal",
      protein: "3g",
      carbs: "15g",
      fat: "16g"
    }
  }
];

// Helper function to find a recipe by id
export const findRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

// Helper function to filter recipes based on available ingredients
export const findRecipesByIngredients = (ingredients: string[]): { recipe: Recipe; matchingCount: number }[] => {
  if (!ingredients.length) return recipes.map(recipe => ({ recipe, matchingCount: 0 }));
  
  return recipes.map(recipe => {
    const matchingCount = recipe.ingredients.filter(ingredient => 
      ingredients.some(userIngredient => 
        ingredient.toLowerCase().includes(userIngredient.toLowerCase())
      )
    ).length;
    
    return { recipe, matchingCount };
  }).sort((a, b) => b.matchingCount - a.matchingCount);
};

export default recipes;
