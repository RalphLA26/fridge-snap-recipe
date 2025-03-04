
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, Check, X } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");
  
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipe.id]);

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
      </div>

      <h1 className="text-2xl font-semibold mb-2">{recipe.title}</h1>
      
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
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`py-2 text-sm font-medium transition-colors relative ${
              activeTab === "ingredients"
                ? "text-fridge-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("ingredients")}
          >
            Ingredients
            {activeTab === "ingredients" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-fridge-600"
                initial={false}
              />
            )}
          </button>
          
          <button
            className={`py-2 text-sm font-medium transition-colors relative ${
              activeTab === "instructions"
                ? "text-fridge-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            Instructions
            {activeTab === "instructions" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-fridge-600"
                initial={false}
              />
            )}
          </button>
        </div>
      </div>
      
      {/* Ingredients tab */}
      {activeTab === "ingredients" && (
        <motion.ul 
          className="space-y-2 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {recipe.ingredients.map((ingredient, index) => (
            <motion.li 
              key={index} 
              variants={item}
              className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-gray-100"
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
            </motion.li>
          ))}
        </motion.ul>
      )}
      
      {/* Instructions tab */}
      {activeTab === "instructions" && (
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
      )}
    </div>
  );
};

export default RecipeDetail;
