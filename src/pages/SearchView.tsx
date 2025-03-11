
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronLeft, Check, X, FileSearch, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

// Common food items for search suggestions
const COMMON_INGREDIENTS = [
  "Apple", "Banana", "Carrot", "Chicken", "Beef", "Potato", "Tomato", "Onion", 
  "Garlic", "Rice", "Pasta", "Cheese", "Milk", "Eggs", "Bread", "Butter", 
  "Spinach", "Broccoli", "Pepper", "Salt", "Olive Oil", "Flour", "Sugar",
  "Lemon", "Lime", "Orange", "Avocado", "Mushroom", "Lettuce", "Cucumber",
  "Yogurt", "Salmon", "Shrimp", "Bean", "Corn", "Pea", "Cauliflower",
  "Ginger", "Honey", "Cinnamon", "Basil", "Mint", "Thyme", "Rosemary",
  "Chocolate", "Vanilla", "Coconut", "Almond", "Peanut", "Coffee", "Tea"
];

const SearchView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedIngredients, setSavedIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
  // Load saved ingredients from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("fridgeIngredients");
    if (saved) {
      const parsedIngredients = JSON.parse(saved);
      setSavedIngredients(parsedIngredients);
    }
  }, []);
  
  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = COMMON_INGREDIENTS
        .filter(item => 
          !savedIngredients.includes(item) && 
          !selectedIngredients.includes(item) && 
          item.toLowerCase().includes(query)
        )
        .slice(0, 10); // Show more suggestions on the dedicated search page
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 || query.length >= 2);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, savedIngredients, selectedIngredients]);
  
  const handleAddIngredient = (ingredient: string = searchQuery) => {
    const trimmedIngredient = ingredient.trim();
    if (!trimmedIngredient) return;
    
    if (savedIngredients.includes(trimmedIngredient)) {
      toast.error("This ingredient is already in your list");
      return;
    }
    
    if (selectedIngredients.includes(trimmedIngredient)) {
      toast.error("You've already selected this ingredient");
      return;
    }
    
    setSelectedIngredients(prev => [...prev, trimmedIngredient]);
    setSearchQuery("");
    toast.success(`Added ${trimmedIngredient} to your selection`);
  };

  const handleRemoveSelected = (ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(item => item !== ingredient));
    toast.info(`Removed ${ingredient} from your selection`);
  };
  
  const handleSaveIngredients = () => {
    if (selectedIngredients.length === 0) {
      toast.warning("Please select at least one ingredient");
      return;
    }
    
    // Combine existing and new ingredients
    const updatedIngredients = [...savedIngredients, ...selectedIngredients];
    
    // Save to localStorage
    localStorage.setItem("fridgeIngredients", JSON.stringify(updatedIngredients));
    
    toast.success(`Added ${selectedIngredients.length} ingredient${selectedIngredients.length !== 1 ? 's' : ''} to your inventory`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-lg mx-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Back button and page title */}
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="hover:bg-fridge-50"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Search Ingredients</h1>
            <div className="w-10"></div> {/* Empty div for centering */}
          </div>
          
          {/* Search input */}
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
                  className="pl-10 pr-12 h-12 bg-white border-fridge-200 focus:border-fridge-400 transition-all shadow-sm"
                  placeholder="Search for ingredients..."
                  autoFocus
                />
                {searchQuery.trim() && (
                  <Button 
                    onClick={() => handleAddIngredient()}
                    size="sm"
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-md bg-fridge-500 hover:bg-fridge-600 text-white p-0"
                    type="button"
                    aria-label="Add ingredient"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-fridge-100/80 overflow-hidden"
                >
                  <div className="py-1 max-h-72 overflow-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleAddIngredient(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-fridge-50 flex items-center gap-2.5 transition-colors"
                      >
                        <FileSearch className="h-4 w-4 text-fridge-600/70" />
                        <span className="font-medium">{suggestion}</span>
                      </button>
                    ))}
                    {suggestions.length === 0 && searchQuery.trim() !== "" && (
                      <div className="px-4 py-4 text-sm text-gray-500">
                        Press Enter to add "<span className="font-medium">{searchQuery.trim()}</span>"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Selected ingredients */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Selected Ingredients {selectedIngredients.length > 0 && (
                <span className="text-sm bg-fridge-100 text-fridge-700 py-0.5 px-2 rounded-full ml-2">
                  {selectedIngredients.length}
                </span>
              )}
            </h2>
            
            {selectedIngredients.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">Search and select ingredients to add to your inventory</p>
              </div>
            ) : (
              <motion.ul 
                className="space-y-2 mb-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {selectedIngredients.map((ingredient) => (
                  <motion.li 
                    key={ingredient}
                    className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-white to-fridge-50 rounded-lg border border-fridge-100/80 shadow-sm group hover:shadow-md transition-all duration-200"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                    layout
                  >
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-fridge-100 to-fridge-50 rounded-full p-1.5 mr-3.5 shadow-sm">
                        <Check className="h-3.5 w-3.5 text-fridge-700" />
                      </div>
                      <span className="text-gray-700 font-medium">{ingredient}</span>
                    </div>
                    <Button
                      onClick={() => handleRemoveSelected(ingredient)}
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
            )}
            
            {/* Save button */}
            {selectedIngredients.length > 0 && (
              <motion.div 
                className="fixed bottom-6 left-0 right-0 px-5 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  onClick={handleSaveIngredients}
                  className="bg-gradient-to-r from-fridge-600 to-fridge-700 hover:from-fridge-700 hover:to-fridge-800 text-white px-8 py-6 rounded-xl shadow-lg w-full max-w-md font-medium text-base"
                  type="button"
                >
                  Add {selectedIngredients.length} Ingredient{selectedIngredients.length !== 1 ? 's' : ''} to Inventory
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SearchView;
