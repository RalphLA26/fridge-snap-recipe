
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, Check, X, Bookmark, Star, Heart, Printer, Share2 } from "lucide-react";
import RecipeScaling from "./RecipeScaling";
import GroceryStoreLocator from "./GroceryStoreLocator";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RecipeDetailProps {
  recipe: {
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
  };
  availableIngredients: string[];
}

const RecipeDetail = ({ recipe, availableIngredients }: RecipeDetailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIngredients, setCurrentIngredients] = useState<string[]>(recipe.ingredients);
  const [focusedIngredient, setFocusedIngredient] = useState<string | null>(null);
  const { isFavorite, addToFavorites, removeFromFavorites, addToShoppingList } = useUser();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const hasIngredient = (ingredient: string) => {
    return availableIngredients.some(i => 
      ingredient.toLowerCase().includes(i.toLowerCase())
    );
  };
  
  const handleIngredientsScaled = (newIngredients: string[]) => {
    setCurrentIngredients(newIngredients);
  };
  
  const handleIngredientClick = (ingredient: string) => {
    setFocusedIngredient(focusedIngredient === ingredient ? null : ingredient);
  };

  const handlePrintRecipe = () => {
    window.print();
    toast.success("Preparing recipe for printing");
  };

  const handleShareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe for ${recipe.title}!`,
        url: window.location.href,
      })
      .then(() => toast.success("Recipe shared successfully"))
      .catch(() => toast.error("Error sharing recipe"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Recipe link copied to clipboard");
    }
  };

  const handleAddAllToShoppingList = () => {
    const missingIngredients = currentIngredients.filter(ingredient => !hasIngredient(ingredient));
    
    if (missingIngredients.length === 0) {
      toast.info("You already have all ingredients");
      return;
    }
    
    missingIngredients.forEach(ingredient => {
      addToShoppingList({
        name: ingredient,
        quantity: "1",
        isChecked: false
      });
    });
    
    toast.success(`Added ${missingIngredients.length} ingredients to shopping list`);
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipe.id]);

  useEffect(() => {
    // Update ingredients when recipe changes
    setCurrentIngredients(recipe.ingredients);
    setFocusedIngredient(null);
  }, [recipe.ingredients]);

  const isFavorited = isFavorite(recipe.id);

  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(recipe.id);
      toast.info("Removed from favorites");
    } else {
      addToFavorites(recipe.id);
      toast.success("Added to favorites");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6 relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-fridge-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 1.05
          }}
          transition={{ duration: 0.5 }}
        />
        <Button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white/95 text-gray-800"
          size="icon"
          variant="ghost"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{recipe.title}</h1>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handlePrintRecipe} title="Print recipe">
            <Printer className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShareRecipe} title="Share recipe">
            <Share2 className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-gray-700">{recipe.cookTime}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Utensils className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-gray-700">{recipe.servings}</span>
        </div>
      </div>
      
      {/* Recipe Scaling */}
      <RecipeScaling 
        originalServings={recipe.servings} 
        ingredients={recipe.ingredients}
        onIngredientsScaled={handleIngredientsScaled}
      />
      
      {/* Nutrition */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-fridge-50 rounded-lg text-center">
          <span className="block text-xs text-gray-500 mb-1">Calories</span>
          <span className="font-medium text-sm">{recipe.nutrition.calories}</span>
        </div>
        <div className="p-3 bg-fridge-50 rounded-lg text-center">
          <span className="block text-xs text-gray-500 mb-1">Protein</span>
          <span className="font-medium text-sm">{recipe.nutrition.protein}</span>
        </div>
        <div className="p-3 bg-fridge-50 rounded-lg text-center">
          <span className="block text-xs text-gray-500 mb-1">Carbs</span>
          <span className="font-medium text-sm">{recipe.nutrition.carbs}</span>
        </div>
        <div className="p-3 bg-fridge-50 rounded-lg text-center">
          <span className="block text-xs text-gray-500 mb-1">Fat</span>
          <span className="font-medium text-sm">{recipe.nutrition.fat}</span>
        </div>
      </div>
      
      {/* Missing ingredients action button */}
      <div className="mb-6">
        <Button 
          onClick={handleAddAllToShoppingList}
          variant="outline" 
          className="w-full"
        >
          Add missing ingredients to shopping list
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="ingredients" className="mb-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        
        {/* Ingredients tab */}
        <TabsContent value="ingredients">
          <motion.ul 
            className="space-y-2 mb-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {currentIngredients.map((ingredient, index) => (
              <motion.li 
                key={index} 
                variants={item}
              >
                <div 
                  className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  onClick={() => handleIngredientClick(ingredient)}
                >
                  <div className="flex items-center">
                    <span className="text-sm">{ingredient}</span>
                  </div>
                  
                  {hasIngredient(ingredient) ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      <span>In fridge</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <X className="h-3 w-3 mr-1" />
                      <span>Not available</span>
                    </div>
                  )}
                </div>
                
                {/* Store locator for focused ingredient */}
                {focusedIngredient === ingredient && !hasIngredient(ingredient) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <GroceryStoreLocator ingredient={ingredient} />
                  </motion.div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </TabsContent>
        
        {/* Instructions tab */}
        <TabsContent value="instructions">
          <motion.ol 
            className="space-y-6 mb-8 list-decimal pl-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {recipe.instructions.map((instruction, index) => (
              <motion.li 
                key={index}
                variants={item}
                className="text-sm leading-relaxed pl-2"
              >
                {instruction}
              </motion.li>
            ))}
          </motion.ol>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeDetail;
