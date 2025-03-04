
import { useState } from "react";
import { Plus, X, Check, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingItem, useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const ShoppingList = () => {
  const { user, addToShoppingList, removeFromShoppingList, toggleShoppingItem, clearShoppingList } = useUser();
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    addToShoppingList({
      name: newItem.trim(),
      quantity: newQuantity.trim() || "1",
      isChecked: false,
    });

    setNewItem("");
    setNewQuantity("");
    toast.success("Item added to shopping list");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Add item to shopping list..."
          />
        </div>
        <div className="flex-initial w-full md:w-24">
          <input
            type="text"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Qty"
          />
        </div>
        <Button 
          onClick={handleAddItem}
          className="h-10 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden md:inline">Add Item</span>
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
            Shopping List
          </h3>
          {user?.shoppingList.length ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                clearShoppingList();
                toast.success("Shopping list cleared");
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          ) : null}
        </div>
        
        {!user?.shoppingList.length ? (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg">
            <p>Your shopping list is empty</p>
          </div>
        ) : (
          <motion.ul 
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {user?.shoppingList.map((item) => (
                <motion.li 
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  className={`flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow-sm border ${
                    item.isChecked ? "border-green-200 bg-green-50" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${
                        item.isChecked ? "bg-green-500 text-white" : "border border-gray-300"
                      }`}
                    >
                      {item.isChecked && <Check className="h-3 w-3" />}
                    </button>
                    <span className={item.isChecked ? "line-through text-gray-500" : ""}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">{item.quantity}</span>
                    <Button
                      onClick={() => removeFromShoppingList(item.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
