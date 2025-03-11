
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Check, Plus, ListChecks, Search, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface IngredientManagerProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onFindRecipes: () => void;
}

// Common food items for search suggestions
const COMMON_INGREDIENTS = [
  "Apple", "Banana", "Carrot", "Chicken", "Beef", "Potato", "Tomato", "Onion", 
  "Garlic", "Rice", "Pasta", "Cheese", "Milk", "Eggs", "Bread", "Butter", 
  "Spinach", "Broccoli", "Pepper", "Salt", "Olive Oil", "Flour", "Sugar",
  "Lemon", "Lime", "Orange", "Avocado", "Mushroom", "Lettuce", "Cucumber",
  "Yogurt", "Salmon", "Shrimp", "Bean", "Corn", "Pea", "Cauliflower"
];

const IngredientManager = ({ 
  ingredients, 
  onAddIngredient, 
  onRemoveIngredient, 
  onFindRecipes 
}: IngredientManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = COMMON_INGREDIENTS.filter(
        item => !ingredients.includes(item) && item.toLowerCase().includes(query)
      ).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, ingredients]);
  
  const handleAddIngredient = (ingredient: string = searchQuery) => {
    const trimmedIngredient = ingredient.trim();
    if (!trimmedIngredient) return;
    
    if (ingredients.includes(trimmedIngredient)) {
      toast.error("This ingredient is already in your list");
      return;
    }
    
    onAddIngredient(trimmedIngredient);
    setSearchQuery("");
    toast.success(`Added ${trimmedIngredient} to your ingredients`);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
    if (searchQuery.trim().length > 0) {
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleSearchBlur = () => {
    // Delayed hiding to allow clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setIsSearching(false);
    }, 150);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="mt-6 border-fridge-100/80 shadow-md overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-fridge-50 to-white pb-3 border-b border-fridge-100/60">
        <CardTitle className="text-xl font-medium text-gray-800 flex items-center">
          <div className="bg-fridge-100 p-1.5 rounded-full mr-2.5">
            <ListChecks className="h-5 w-5 text-fridge-700" />
          </div>
          My Ingredients
          {ingredients.length > 0 && (
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="ml-2 text-sm bg-fridge-500 text-white py-0.5 px-2.5 rounded-full"
            >
              {ingredients.length}
            </motion.span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Search ingredient input */}
          <div className="relative">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10 pr-12 h-12 bg-gray-50 border-fridge-100 focus:border-fridge-300 transition-all"
                  placeholder="Search for an ingredient..."
                />
                <Button 
                  onClick={() => handleAddIngredient()}
                  size="sm"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-md bg-fridge-500 hover:bg-fridge-600 text-white p-0"
                  type="button"
                  aria-label="Add ingredient"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Search suggestions */}
            <AnimatePresence>
              {isSearching && showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-fridge-100/80 overflow-hidden"
                >
                  <div className="py-1 max-h-64 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        onClick={() => handleAddIngredient(suggestion)}
                        className="w-full text-left px-4 py-2.5 hover:bg-fridge-50 flex items-center gap-2.5 transition-colors"
                      >
                        <FileSearch className="h-4 w-4 text-fridge-600/70" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                    {suggestions.length === 0 && searchQuery.trim() !== "" && (
                      <div className="px-4 py-3 text-sm text-gray-500 italic">
                        Press Enter to add "{searchQuery.trim()}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <AnimatePresence>
              {ingredients.length === 0 ? (
                <motion.div 
                  className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-fridge-100 rounded-full p-4 mb-3 shadow-sm">
                      <PlusCircle className="h-6 w-6 text-fridge-600" />
                    </div>
                    <p className="text-gray-500 max-w-[220px] mx-auto">Search and add ingredients to get started with recipe suggestions.</p>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <motion.ul 
                    className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 mb-5 py-1 divide-y divide-gray-100"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {ingredients.map((ingredient, index) => (
                      <motion.li 
                        key={ingredient}
                        className="flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-white to-fridge-50 rounded-lg border border-fridge-100/80 group hover:from-fridge-50 hover:to-fridge-100/90 transition-all duration-200 shadow-sm"
                        variants={item}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-fridge-100 to-fridge-50 rounded-full p-1.5 mr-3.5 shadow-sm">
                            <Check className="h-3.5 w-3.5 text-fridge-700" />
                          </div>
                          <span className="text-gray-700 font-medium">{ingredient}</span>
                        </div>
                        <Button
                          onClick={() => onRemoveIngredient(ingredient)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-fridge-200/80 opacity-70 group-hover:opacity-100"
                          type="button"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {ingredients.length > 0 && (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        onClick={onFindRecipes}
                        className="bg-gradient-to-r from-fridge-600 to-fridge-700 hover:from-fridge-700 hover:to-fridge-800 text-white px-5 py-6 rounded-lg shadow-md inline-flex items-center font-medium"
                        type="button"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientManager;
