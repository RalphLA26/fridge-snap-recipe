
import { useState } from "react";
import { Lightbulb, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Common substitutions database
const commonSubstitutions: Record<string, string[]> = {
  "eggs": ["1/4 cup applesauce", "1/4 cup mashed banana", "1 tbsp ground flaxseed + 3 tbsp water"],
  "butter": ["olive oil", "coconut oil", "applesauce", "greek yogurt"],
  "milk": ["almond milk", "soy milk", "oat milk", "coconut milk"],
  "sugar": ["honey", "maple syrup", "stevia", "coconut sugar"],
  "flour": ["almond flour", "coconut flour", "oat flour", "gluten-free flour blend"],
  "buttermilk": ["1 cup milk + 1 tbsp lemon juice", "1 cup yogurt", "1 cup milk + 1 tbsp vinegar"],
  "sour cream": ["greek yogurt", "cottage cheese", "cream cheese"],
  "breadcrumbs": ["crushed crackers", "rolled oats", "crushed chips", "crushed nuts"],
  "rice": ["quinoa", "cauliflower rice", "barley", "couscous"],
  "pasta": ["zucchini noodles", "spaghetti squash", "shirataki noodles", "lentil pasta"],
  "heavy cream": ["coconut cream", "evaporated milk", "greek yogurt"],
  "mayonnaise": ["greek yogurt", "mashed avocado", "hummus"],
  "vegetable oil": ["applesauce", "mashed banana", "coconut oil", "olive oil"],
  "wine": ["grape juice", "broth", "vinegar diluted with water"],
  "soy sauce": ["coconut aminos", "tamari", "worcestershire sauce"],
  "honey": ["maple syrup", "agave nectar", "brown rice syrup"],
};

interface IngredientSubstitutionsProps {
  ingredients: string[];
}

const IngredientSubstitutions = ({ ingredients }: IngredientSubstitutionsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userSubstitutions, setUserSubstitutions] = useState<{ ingredient: string, substitution: string }[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newSubstitution, setNewSubstitution] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const findSubstitutionsForIngredient = (ingredient: string) => {
    // Check if there's an exact match in our database
    const key = Object.keys(commonSubstitutions).find(k => 
      ingredient.toLowerCase().includes(k.toLowerCase())
    );
    
    if (key) {
      return commonSubstitutions[key];
    }
    
    // Check for user-added substitutions
    const userSubs = userSubstitutions
      .filter(s => ingredient.toLowerCase().includes(s.ingredient.toLowerCase()))
      .map(s => s.substitution);
    
    if (userSubs.length > 0) {
      return userSubs;
    }
    
    return null;
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    if (!searchTerm) return true;
    return ingredient.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleAddSubstitution = () => {
    if (!newIngredient.trim() || !newSubstitution.trim()) {
      toast.error("Please enter both ingredient and substitution");
      return;
    }
    
    setUserSubstitutions([
      ...userSubstitutions,
      { ingredient: newIngredient.trim(), substitution: newSubstitution.trim() }
    ]);
    
    setNewIngredient("");
    setNewSubstitution("");
    setShowAddForm(false);
    toast.success("Substitution added successfully");
  };
  
  // Animation variants
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
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-medium mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-fridge-600" />
          Ingredient Substitutions
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-fridge-600"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Custom
        </Button>
      </h2>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="mb-4 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Ingredient name"
              />
              <Input
                value={newSubstitution}
                onChange={(e) => setNewSubstitution(e.target.value)}
                placeholder="Substitution"
              />
            </div>
            <div className="flex justify-end mt-3 space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddSubstitution}
                className="bg-fridge-600 hover:bg-fridge-700 text-white"
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ingredients for substitutions..."
          className="pl-9"
        />
      </div>
      
      <motion.div 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredIngredients.map((ingredient, index) => {
          const substitutions = findSubstitutionsForIngredient(ingredient);
          
          if (!substitutions) return null;
          
          return (
            <motion.div 
              key={index}
              variants={item}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex flex-wrap items-start gap-2">
                <div className="bg-fridge-50 text-fridge-700 px-2 py-1 rounded text-sm font-medium">
                  {ingredient}
                </div>
                <div className="text-gray-500">→</div>
                <div className="flex flex-wrap gap-2">
                  {substitutions.map((sub, i) => (
                    <div key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {filteredIngredients.length > 0 && 
         filteredIngredients.every(ingredient => !findSubstitutionsForIngredient(ingredient)) && (
          <p className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            No substitutions found for these ingredients. Try adding a custom substitution!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default IngredientSubstitutions;
