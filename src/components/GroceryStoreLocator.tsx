
import { useState, useEffect } from "react";
import { MapPin, ExternalLink, ShoppingCart, Store } from "lucide-react";
import { checkItemAvailability, GroceryStore } from "@/lib/groceryStoreLocator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";

interface GroceryStoreLocatorProps {
  ingredient: string;
}

const GroceryStoreLocator = ({ ingredient }: GroceryStoreLocatorProps) => {
  const [loading, setLoading] = useState(false);
  const [storeResults, setStoreResults] = useState<Array<{
    store: GroceryStore;
    price: number;
    inStock: boolean;
  }> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { addToShoppingList } = useUser();
  
  const checkAvailability = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const results = await checkItemAvailability(ingredient);
      setStoreResults(results);
      setExpanded(true);
    } catch (error) {
      toast.error("Failed to check store availability");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = () => {
    addToShoppingList({
      name: ingredient,
      quantity: "1",
      isChecked: false
    });
    toast.success(`Added ${ingredient} to shopping list`);
  };
  
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-md border border-fridge-100/80 hover:shadow-lg transition-all duration-300">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto font-normal bg-gradient-to-r from-fridge-50 to-white"
        onClick={expanded ? () => setExpanded(false) : checkAvailability}
      >
        <div className="flex items-center">
          <Store className="h-4 w-4 mr-2 text-fridge-600" />
          <span className="text-sm">Find "{ingredient}" at nearby stores</span>
        </div>
        <span className="text-xs bg-fridge-50 px-2 py-0.5 rounded-full text-fridge-600 font-medium">
          {expanded ? "Hide" : "Check"}
        </span>
      </Button>
      
      <AnimatePresence>
        {expanded && storeResults && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 pt-1 bg-gradient-to-b from-fridge-50/50 to-white border-t border-fridge-100"
          >
            <div className="space-y-3 mt-2">
              {storeResults.map((result) => (
                <motion.div 
                  key={result.store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                  className="bg-white p-3.5 rounded-xl shadow-sm border border-fridge-100 flex justify-between items-center hover:border-fridge-200 transition-all"
                >
                  <div>
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-fridge-50 flex items-center justify-center flex-shrink-0 mr-3 shadow-sm">
                        <Store className="h-4 w-4 text-fridge-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{result.store.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 flex items-center">
                          <span className="mr-2">{result.store.distance.toFixed(1)} miles</span>
                          <span className={result.inStock ? 'text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium' : 'text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full font-medium'}>
                            {result.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {result.price > 0 && (
                      <p className="font-medium text-sm mb-1 rounded-full bg-green-50 px-2.5 py-0.5 text-green-700 shadow-sm">
                        ${result.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              <div className="pt-2 flex justify-between items-center">
                <Button 
                  variant="link" 
                  className="text-xs flex items-center text-gray-600 p-0 h-auto hover:text-fridge-700"
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open in Maps
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs bg-fridge-50 hover:bg-fridge-100 text-fridge-700 border border-fridge-200 shadow-sm hover:shadow"
                  onClick={handleAddToList}
                >
                  <ShoppingCart className="h-3 w-3 mr-1.5" />
                  Add to List
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading && (
        <div className="p-4 flex justify-center">
          <div className="w-5 h-5 border-2 border-fridge-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default GroceryStoreLocator;
