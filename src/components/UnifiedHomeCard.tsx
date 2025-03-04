
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Search, Check, X, Plus, ArrowRight, Refrigerator, Utensils, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface UnifiedHomeCardProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onCameraClick: () => void;
  onFindRecipes: () => void;
}

const UnifiedHomeCard = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onCameraClick,
  onFindRecipes
}: UnifiedHomeCardProps) => {
  const [newIngredient, setNewIngredient] = useState("");
  const [activeTab, setActiveTab] = useState("fridge");

  const handleAddIngredient = () => {
    const ingredient = newIngredient.trim();
    if (!ingredient) return;
    
    if (ingredients.includes(ingredient)) {
      toast.error("This ingredient is already in your list");
      return;
    }
    
    onAddIngredient(ingredient);
    setNewIngredient("");
    toast.success(`Added ${ingredient} to your ingredients`);
  };

  // Animation variants for list items
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-white rounded-bl-full"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-1.5 rounded-xl mr-3">
              <Refrigerator className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-base">
            Turn your ingredients into delicious recipes with just a few clicks.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <svg className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <line x1="10" y1="2" x2="10" y2="10" />
          </svg>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={onCameraClick}
            className="h-auto py-3 px-4 flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl shadow-sm border border-gray-100 group cursor-pointer transition-all duration-200"
            variant="outline"
            type="button"
          >
            <div className="w-10 h-10 bg-fridge-50 rounded-full flex items-center justify-center group-hover:bg-fridge-100 transition-colors shrink-0">
              <Camera className="w-5 h-5 text-fridge-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm mb-0.5">Scan Ingredients</h3>
              <p className="text-xs text-gray-500">Take a photo of your fridge</p>
            </div>
          </Button>

          <Button
            onClick={onFindRecipes}
            disabled={ingredients.length === 0}
            className="h-auto py-3 px-4 flex items-center gap-3 bg-gradient-to-br from-fridge-500 to-fridge-600 hover:from-fridge-600 hover:to-fridge-700 text-white rounded-xl shadow-sm border border-fridge-400 group cursor-pointer disabled:opacity-70 transition-all duration-200"
            type="button"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm mb-0.5">Find Recipes</h3>
              <p className="text-xs text-white/80">
                {ingredients.length > 0 
                  ? `Use your ${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''}`
                  : 'Add ingredients first'}
              </p>
            </div>
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="p-4">
        <Tabs 
          defaultValue="fridge" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-50 rounded-xl p-1">
            <TabsTrigger 
              value="fridge" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 transition-all duration-200"
            >
              <Refrigerator className="h-4 w-4 mr-2" />
              Fridge
            </TabsTrigger>
            <TabsTrigger 
              value="ingredients" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 transition-all duration-200"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Ingredients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fridge" className="mt-0 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="bg-fridge-100 rounded-full p-1.5 mr-2.5">
                  <Refrigerator className="h-4 w-4 text-fridge-600" />
                </span>
                My Fridge
                {ingredients.length > 0 && (
                  <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
                    {ingredients.length}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2 transition-all duration-200"
                  placeholder="Add items in your fridge..."
                />
                <Button 
                  onClick={handleAddIngredient}
                  size="icon"
                  className="h-11 w-11 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
                  type="button"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              <div>
                {ingredients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-full p-3 mb-3">
                        <Refrigerator className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm">Your fridge is empty. Add ingredients or take a photo.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.ul 
                      className="space-y-2 max-h-[240px] overflow-y-auto pr-1 mb-4 scrollbar-hidden"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {ingredients.map((ingredient) => (
                        <motion.li 
                          key={ingredient}
                          variants={item}
                          className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-fridge-100 rounded-full p-1 mr-2">
                              <Check className="h-3 w-3 text-fridge-600" />
                            </div>
                            <span className="font-medium text-sm">{ingredient}</span>
                          </div>
                          <Button
                            onClick={() => onRemoveIngredient(ingredient)}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-white cursor-pointer transition-all duration-200"
                            type="button"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </motion.li>
                      ))}
                    </motion.ul>
                    
                    <div className="text-center">
                      <Button 
                        onClick={onFindRecipes}
                        className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-5 py-2.5 cursor-pointer text-sm"
                        type="button"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-0 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="bg-fridge-100 rounded-full p-1.5 mr-2.5">
                  <Utensils className="h-4 w-4 text-fridge-600" />
                </span>
                My Ingredients
                {ingredients.length > 0 && (
                  <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
                    {ingredients.length}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2 transition-all duration-200"
                  placeholder="Add new ingredients..."
                />
                <Button 
                  onClick={handleAddIngredient}
                  size="icon"
                  className="h-11 w-11 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
                  type="button"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              <div>
                {ingredients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-full p-3 mb-3">
                        <Utensils className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm">No ingredients added yet. Add ingredients to get started.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.ul 
                      className="space-y-2 max-h-[240px] overflow-y-auto pr-1 mb-4 scrollbar-hidden"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {ingredients.map((ingredient) => (
                        <motion.li 
                          key={ingredient}
                          variants={item}
                          className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-fridge-100 rounded-full p-1 mr-2">
                              <Check className="h-3 w-3 text-fridge-600" />
                            </div>
                            <span className="font-medium text-sm">{ingredient}</span>
                          </div>
                          <Button
                            onClick={() => onRemoveIngredient(ingredient)}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-white cursor-pointer transition-all duration-200"
                            type="button"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </motion.li>
                      ))}
                    </motion.ul>
                    
                    <div className="text-center">
                      <Button 
                        onClick={onFindRecipes}
                        className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-5 py-2.5 cursor-pointer text-sm"
                        type="button"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default UnifiedHomeCard;
