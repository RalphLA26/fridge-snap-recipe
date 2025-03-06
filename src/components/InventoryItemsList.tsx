
import { useState } from "react";
import { InventoryItem } from "@/pages/InventoryView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShoppingCart, Edit2, Check, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getExpiryStatus } from "@/lib/inventoryUtils";

interface InventoryItemsListProps {
  items: InventoryItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: string, unit?: string) => void;
  onUpdateExpiryDate: (id: string, expiryDate: string) => void;
  onAddToShoppingList: (item: InventoryItem) => void;
}

const QUANTITY_UNITS = [
  "pcs", "g", "kg", "ml", "L", "tbsp", "tsp", "cup", "oz", "lb", "bunch", "can", "bottle", "box", "package"
];

const InventoryItemsList = ({ 
  items, 
  onRemove, 
  onUpdateQuantity,
  onUpdateExpiryDate,
  onAddToShoppingList
}: InventoryItemsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editingExpiryId, setEditingExpiryId] = useState<string | null>(null);
  const [editExpiryDate, setEditExpiryDate] = useState("");
  
  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit || "pcs");
  };
  
  const handleSaveEdit = (id: string) => {
    onUpdateQuantity(id, editQuantity, editUnit);
    setEditingId(null);
  };

  const handleStartEditExpiry = (item: InventoryItem) => {
    setEditingExpiryId(item.id);
    setEditExpiryDate(item.expiryDate || "");
  };
  
  const handleSaveEditExpiry = (id: string) => {
    onUpdateExpiryDate(id, editExpiryDate);
    setEditingExpiryId(null);
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

  // Get human-readable expiry info
  const getExpiryInfo = (expiryDate: string | undefined) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffInDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return `Expired ${Math.abs(diffInDays)} days ago`;
    } else if (diffInDays === 0) {
      return "Expires today";
    } else if (diffInDays === 1) {
      return "Expires tomorrow";
    } else if (diffInDays < 7) {
      return `Expires in ${diffInDays} days`;
    } else {
      return `Expires on ${expiry.toLocaleDateString()}`;
    }
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
        items.map((item) => {
          const expiryStatus = item.expiryDate ? getExpiryStatus(item.expiryDate) : null;
          return (
            <motion.li 
              key={item.id}
              variants={itemVariants}
              className={cn(
                "py-3 flex items-center justify-between hover:bg-gray-50 rounded-md p-2 transition-colors",
                editingId === item.id || editingExpiryId === item.id ? "bg-gray-50" : "",
                expiryStatus === 'expired' ? "border-l-4 border-red-500" : 
                expiryStatus === 'expiring-soon' ? "border-l-4 border-amber-500" : ""
              )}
            >
              <div className="flex items-start flex-col sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <div className={cn(
                    "flex-shrink-0 h-2 w-2 rounded-full mr-2",
                    getCategoryColor(item.category)
                  )} />
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                
                <div className="flex items-center mt-1 sm:mt-0 sm:ml-3">
                  {editingId === item.id ? (
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        className="w-14 h-7 text-xs mr-1"
                        autoFocus
                      />
                      <Select value={editUnit} onValueChange={setEditUnit}>
                        <SelectTrigger className="w-16 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUANTITY_UNITS.map(unit => (
                            <SelectItem key={unit} value={unit} className="text-xs">
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        {item.quantity} {item.unit || "pcs"}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(item)}
                        className="h-7 w-7 ml-1"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center mt-1 sm:mt-0 sm:ml-3">
                  {editingExpiryId === item.id ? (
                    <div className="flex items-center">
                      <Input
                        type="date"
                        value={editExpiryDate}
                        onChange={(e) => setEditExpiryDate(e.target.value)}
                        className="w-32 h-7 text-xs"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveEditExpiry(item.id)}
                        className="h-7 w-7 ml-1"
                      >
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                    </div>
                  ) : item.expiryDate ? (
                    <div 
                      className={cn(
                        "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                        expiryStatus === 'good' ? "bg-green-50 text-green-700" :
                        expiryStatus === 'expiring-soon' ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      )}
                      title={getExpiryInfo(item.expiryDate)}
                    >
                      <Calendar className="h-3 w-3" />
                      {new Date(item.expiryDate).toLocaleDateString()}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEditExpiry(item)}
                        className="h-5 w-5 ml-1 p-0"
                      >
                        <Edit2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleStartEditExpiry(item)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Add expiry
                    </Button>
                  )}
                </div>
                
                <div className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-0 sm:ml-3 mt-1 sm:mt-0">
                  {item.category}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center">
                <span className="text-xs text-gray-400 hidden sm:inline mr-2">
                  {getItemAge(item.addedAt)}
                </span>
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
              </div>
            </motion.li>
          );
        })
      )}
    </motion.ul>
  );
};

// Helper function to get color based on category
function getCategoryColor(category: string) {
  switch (category) {
    case "Fruits & Vegetables":
      return "bg-green-500";
    case "Dairy & Eggs":
      return "bg-blue-400";
    case "Meat & Seafood":
      return "bg-red-500";
    case "Pantry":
      return "bg-amber-500";
    case "Frozen":
      return "bg-sky-500";
    case "Beverages":
      return "bg-purple-500";
    case "Spices & Condiments":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}

export default InventoryItemsList;
