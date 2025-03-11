
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Utensils, Check, X, Heart, Printer, Share2, ChevronDown, Info, CircleAlert } from "lucide-react";
import RecipeScaling from "./RecipeScaling";
import GroceryStoreLocator from "./GroceryStoreLocator";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  const [activeSection, setActiveSection] = useState<string>("ingredients");
  
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

  // Calculate missing ingredients count
  const missingIngredientsCount = currentIngredients.filter(
    ingredient => !hasIngredient(ingredient)
  ).length;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Hero section with image */}
      <motion.div 
        className="mb-6 relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        
        {/* Overlay gradient for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
        
        {/* Recipe type badge */}
        <motion.div 
          className="absolute top-4 left-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 font-medium shadow-sm">
            Homemade Recipe
          </Badge>
        </motion.div>
        
        {/* Favorite button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
        >
          <Button 
            onClick={toggleFavorite}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white/95 text-gray-800 shadow-md"
            size="icon"
            variant="ghost"
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </motion.div>
        
        {/* Title on image with gradient background for better readability */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-5 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-shadow">{recipe.title}</h1>
        </motion.div>
      </motion.div>

      {/* Recipe meta info - time and servings */}
      <motion.div 
        className="flex items-center justify-between mb-6 px-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center bg-fridge-50 px-3 py-2 rounded-lg shadow-sm border border-fridge-100"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Clock className="h-4 w-4 mr-2 text-fridge-600" />
            <span className="text-sm font-medium">{recipe.cookTime}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center bg-fridge-50 px-3 py-2 rounded-lg shadow-sm border border-fridge-100"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Utensils className="h-4 w-4 mr-2 text-fridge-600" />
            <span className="text-sm font-medium">{recipe.servings}</span>
          </motion.div>
        </div>
        
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={handlePrintRecipe} title="Print recipe">
              <Printer className="h-5 w-5 text-gray-500" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={handleShareRecipe} title="Share recipe">
              <Share2 className="h-5 w-5 text-gray-500" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Action card: Missing ingredients */}
      {missingIngredientsCount > 0 && (
        <motion.div 
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start">
            <CircleAlert className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Missing ingredients</h3>
              <p className="text-sm text-amber-700 mb-3">
                You're missing {missingIngredientsCount} of {currentIngredients.length} ingredients for this recipe.
              </p>
              <Button 
                onClick={handleAddAllToShoppingList}
                variant="secondary" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm"
                size="sm"
              >
                Add missing ingredients to shopping list
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Recipe Scaling */}
      <motion.div 
        className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-medium mb-2 text-gray-700">Adjust servings</h3>
        <RecipeScaling 
          originalServings={recipe.servings} 
          ingredients={recipe.ingredients}
          onIngredientsScaled={handleIngredientsScaled}
        />
      </motion.div>
      
      {/* Nutrition cards */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-medium mb-3 text-gray-700">Nutrition per serving</h3>
        <div className="grid grid-cols-4 gap-3">
          <motion.div 
            className="p-3 bg-gradient-to-br from-fridge-50 to-fridge-100 rounded-lg text-center shadow-sm border border-fridge-100"
            whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="block text-xs text-gray-500 mb-1">Calories</span>
            <span className="font-medium text-fridge-800">{recipe.nutrition.calories}</span>
          </motion.div>
          <motion.div 
            className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center shadow-sm border border-blue-100"
            whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="block text-xs text-gray-500 mb-1">Protein</span>
            <span className="font-medium text-blue-800">{recipe.nutrition.protein}</span>
          </motion.div>
          <motion.div 
            className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center shadow-sm border border-green-100"
            whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="block text-xs text-gray-500 mb-1">Carbs</span>
            <span className="font-medium text-green-800">{recipe.nutrition.carbs}</span>
          </motion.div>
          <motion.div 
            className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg text-center shadow-sm border border-amber-100"
            whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="block text-xs text-gray-500 mb-1">Fat</span>
            <span className="font-medium text-amber-800">{recipe.nutrition.fat}</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Tabs 
          defaultValue="ingredients" 
          className="mb-6"
          value={activeSection}
          onValueChange={setActiveSection}
        >
          <TabsList className="w-full grid grid-cols-2 rounded-xl bg-gray-100 p-1 shadow-inner">
            <TabsTrigger 
              value="ingredients" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-fridge-700 data-[state=active]:shadow-md font-medium"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger 
              value="instructions" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-fridge-700 data-[state=active]:shadow-md font-medium"
            >
              Instructions
            </TabsTrigger>
          </TabsList>
          
          {/* Ingredients tab */}
          <TabsContent value="ingredients" className="mt-4">
            <AnimatePresence mode="wait">
              <motion.ul 
                className="space-y-2 mb-8"
                variants={container}
                initial="hidden"
                animate="show"
                key="ingredients-list"
              >
                {currentIngredients.map((ingredient, index) => (
                  <motion.li 
                    key={`${ingredient}-${index}`} 
                    variants={item}
                    layout
                  >
                    <motion.div 
                      className={`flex items-center justify-between py-3 px-4 rounded-lg shadow-sm border transition-colors duration-150 ${
                        hasIngredient(ingredient) 
                          ? 'bg-white border-green-100' 
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() => handleIngredientClick(ingredient)}
                      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                    >
                      <div className="flex items-center">
                        {hasIngredient(ingredient) ? (
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span className="text-sm">{ingredient}</span>
                      </div>
                      
                      {hasIngredient(ingredient) ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          In fridge
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                          Missing
                        </Badge>
                      )}
                    </motion.div>
                    
                    {/* Store locator for focused ingredient */}
                    <AnimatePresence>
                      {focusedIngredient === ingredient && !hasIngredient(ingredient) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                        >
                          <GroceryStoreLocator ingredient={ingredient} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </TabsContent>
          
          {/* Instructions tab */}
          <TabsContent value="instructions" className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="instructions-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.ol 
                  className="space-y-5 mb-8 relative"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {/* Timeline connector */}
                  <div className="absolute left-[18px] top-8 bottom-0 w-[2px] bg-fridge-200"></div>
                  
                  {recipe.instructions.map((instruction, index) => (
                    <motion.li 
                      key={index}
                      variants={item}
                      className="pl-12 pb-4 relative"
                    >
                      {/* Step number indicator */}
                      <motion.div 
                        className="absolute left-0 top-0 flex items-center justify-center w-9 h-9 rounded-full bg-fridge-100 text-fridge-700 font-semibold text-sm border border-fridge-200 z-10"
                        whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                      >
                        {index + 1}
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                        whileHover={{ y: -2, boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.05)" }}
                      >
                        <p className="text-sm leading-relaxed text-gray-700">{instruction}</p>
                      </motion.div>
                    </motion.li>
                  ))}
                </motion.ol>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default RecipeDetail;
