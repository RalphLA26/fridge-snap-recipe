
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const InventoryView = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load saved ingredients from localStorage on initial render
  useEffect(() => {
    const savedIngredients = localStorage.getItem("fridgeIngredients");
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);
  
  // Save ingredients to localStorage whenever the ingredients state changes
  useEffect(() => {
    localStorage.setItem("fridgeIngredients", JSON.stringify(ingredients));
  }, [ingredients]);
  
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) {
      toast.error("Please enter an ingredient name");
      return;
    }
    
    setIngredients(prev => [...prev, newIngredient.trim()]);
    setNewIngredient("");
    toast.success("Ingredient added to inventory");
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(item => item !== ingredient));
    toast.success("Ingredient removed from inventory");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };
  
  const filteredIngredients = ingredients.filter(ingredient => 
    ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      
      <main className="flex-1 container max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">My Inventory</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/camera")}
            className="text-fridge-600 border-fridge-200 hover:bg-fridge-50"
          >
            Scan Items
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex space-x-2 mb-6">
            <Input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add new item to inventory..."
              className="flex-1"
            />
            <Button 
              onClick={handleAddIngredient}
              className="bg-fridge-600 hover:bg-fridge-700 text-white"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add
            </Button>
          </div>
          
          {ingredients.length > 0 && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          )}
          
          {ingredients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your inventory is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add ingredients or scan items with your camera</p>
            </div>
          ) : filteredIngredients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items match your search</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredIngredients.map((ingredient, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <span className="text-gray-700">{ingredient}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIngredient(ingredient)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          
          {ingredients.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {ingredients.length} item{ingredients.length !== 1 ? 's' : ''} in inventory
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/recipes")}
                className="bg-fridge-50 text-fridge-600 border-fridge-200 hover:bg-fridge-100"
              >
                Find Recipes
              </Button>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default InventoryView;
