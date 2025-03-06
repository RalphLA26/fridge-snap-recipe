
import { useState } from "react";
import { InventoryItem } from "@/pages/InventoryView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart, Edit2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InventoryItemsListProps {
  items: InventoryItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: string) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
}

const InventoryItemsList = ({ 
  items, 
  onRemove, 
  onUpdateQuantity,
  onAddToShoppingList
}: InventoryItemsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.quantity);
  };
  
  const handleSaveEdit = (id: string) => {
    onUpdateQuantity(id, editValue);
    setEditingId(null);
  };
  
  // Calculate time difference
  const getItemAge = (dateString: string) => {
    const addedDate = new Date(dateString);
    const now = new Date();
    
    const diffInMs = now.getTime() - addedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };
  
  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.ul 
      className="divide-y divide-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.length === 0 ? (
        <li className="py-4 text-center text-gray-500">
          No items in this category
        </li>
      ) : (
        items.map((item) => (
          <motion.li 
            key={item.id}
            variants={itemVariants}
            className={cn(
              "py-3 flex items-center justify-between hover:bg-gray-50 rounded-md p-2 transition-colors",
              editingId === item.id ? "bg-gray-50" : ""
            )}
          >
            <div className="flex items-start flex-col sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-fridge-500 mr-2" />
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              
              <div className="flex items-center mt-1 sm:mt-0 sm:ml-3">
                {editingId === item.id ? (
                  <div className="flex items-center">
                    <Input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 h-7 text-xs"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(item.id)}
                      className="h-7 w-7 ml-1"
                    >
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm bg-fridge-50 px-2 py-0.5 rounded-full text-fridge-800">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(item)}
                      className="h-7 w-7 ml-1"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                    </Button>
                    <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
                      {getItemAge(item.addedAt)}
                    </span>
                  </>
                )}
              </div>
              
              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-0 sm:ml-3 mt-1 sm:mt-0">
                {item.category}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddToShoppingList(item)}
                className="h-8 w-8 text-fridge-600 hover:text-fridge-800 hover:bg-fridge-50"
                title="Add to shopping list"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.li>
        ))
      )}
    </motion.ul>
  );
};

export default InventoryItemsList;
