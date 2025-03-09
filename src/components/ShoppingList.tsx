
import { useState } from "react";
import { Plus, X, Check, ShoppingBag, Trash2, ListFilter, Search, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingItem, useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SortOption = "added" | "alphabetical" | "checked";

interface ShoppingListProps {
  hideDeliveryButton?: boolean;
}

const ShoppingList = ({ hideDeliveryButton = false }: ShoppingListProps) => {
  const { user, addToShoppingList, removeFromShoppingList, toggleShoppingItem, clearShoppingList } = useUser();
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("added");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

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
    if (window.innerWidth < 768) {
      setShowForm(false); // Hide form after adding on mobile
    }
    toast.success("Item added to shopping list");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const sortItems = (items: ShoppingItem[]) => {
    if (!items.length) return [];
    
    const itemsCopy = [...items];
    
    switch (sortOption) {
      case "alphabetical":
        return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "checked":
        return itemsCopy.sort((a, b) => {
          // Sort by checked status (unchecked first)
          if (a.isChecked !== b.isChecked) {
            return a.isChecked ? 1 : -1;
          }
          // Then by name
          return a.name.localeCompare(b.name);
        });
      case "added":
      default:
        // Items are already in the order they were added
        return itemsCopy;
    }
  };

  // Filter items based on search query
  const filterItems = (items: ShoppingItem[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortedItems = user?.shoppingList ? sortItems(user.shoppingList) : [];
  const filteredItems = filterItems(sortedItems);
  const hasItems = sortedItems.length > 0;
  const itemsLeft = sortedItems.filter(item => !item.isChecked).length;
  const completedItems = sortedItems.filter(item => item.isChecked).length;

  // Group items by categories
  const groupedItems = {
    unchecked: filteredItems.filter(item => !item.isChecked),
    checked: filteredItems.filter(item => item.isChecked)
  };

  return (
    <div className="space-y-4">
      {/* Mobile add button - only visible on mobile when form is hidden */}
      {!showForm && (
        <div className="md:hidden">
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full rounded-xl bg-fridge-600 hover:bg-fridge-700 text-white transition-all duration-200 shadow-sm hover:shadow"
          >
            <Plus className="h-5 w-5 mr-1" />
            <span>Add Item</span>
          </Button>
        </div>
      )}
      
      {/* Input area with improved styling - conditionally shown on mobile */}
      <AnimatePresence>
        {(showForm || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-sm p-4 border border-fridge-100">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-700">Add Item</h3>
                  {window.innerWidth < 768 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      className="h-7 w-7 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <div className="flex-1 w-full">
                    <Input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="border-fridge-100 focus:border-fridge-400"
                      placeholder="Add item to shopping list..."
                    />
                  </div>
                  <div className="flex-initial w-full md:w-24">
                    <Input
                      type="text"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="border-fridge-100 focus:border-fridge-400"
                      placeholder="Qty"
                    />
                  </div>
                  <Button 
                    onClick={handleAddItem}
                    className="h-10 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white w-full md:w-auto transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    <span>Add Item</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Shopping list area */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
            Your Items 
            {hasItems && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({itemsLeft} left, {completedItems} completed)
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50 border-fridge-100">
                  <ListFilter className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => setSortOption("added")} className="hover:bg-fridge-50">
                  Most Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("alphabetical")} className="hover:bg-fridge-50">
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("checked")} className="hover:bg-fridge-50">
                  Unchecked First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {hasItems && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  clearShoppingList();
                  toast.success("Shopping list cleared");
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-fridge-100"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Search bar - only show when there are items */}
        {hasItems && (
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-fridge-100"
            />
          </div>
        )}
        
        {!hasItems ? (
          <div className="text-center py-12 bg-fridge-50/50 rounded-lg border border-fridge-100">
            <ShoppingBag className="h-12 w-12 mx-auto text-fridge-300 mb-3" />
            <p className="text-gray-600 mb-1">Your shopping list is empty</p>
            <p className="text-sm text-gray-500">Add items to your shopping list</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-fridge-50/50 rounded-lg border border-fridge-100">
            <p>No items match your search</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unchecked items */}
            {groupedItems.unchecked.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1 text-fridge-500" />
                  Items to Buy ({groupedItems.unchecked.length})
                </h4>
                <motion.ul 
                  className="space-y-2.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {groupedItems.unchecked.map((item) => (
                      <ShoppingListItem 
                        key={item.id} 
                        item={item} 
                        onToggle={() => toggleShoppingItem(item.id)}
                        onRemove={() => removeFromShoppingList(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </div>
            )}
            
            {/* Checked items */}
            {groupedItems.checked.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <ListChecks className="h-4 w-4 mr-1 text-green-500" />
                  Purchased Items ({groupedItems.checked.length})
                </h4>
                <motion.ul 
                  className="space-y-2.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {groupedItems.checked.map((item) => (
                      <ShoppingListItem 
                        key={item.id} 
                        item={item} 
                        onToggle={() => toggleShoppingItem(item.id)}
                        onRemove={() => removeFromShoppingList(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted shopping list item component
const ShoppingListItem = ({ 
  item, 
  onToggle, 
  onRemove 
}: { 
  item: ShoppingItem; 
  onToggle: () => void; 
  onRemove: () => void;
}) => {
  return (
    <motion.li 
      variants={itemVariants}
      exit="exit"
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-xl shadow-sm border transform transition-all duration-200 hover:shadow",
        item.isChecked 
          ? "border-green-200 bg-gradient-to-r from-green-50 to-green-50/60" 
          : "border-fridge-100 bg-white"
      )}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center h-6 w-6 rounded-full mr-3 transition-colors",
            item.isChecked 
              ? "bg-green-500 text-white" 
              : "border-2 border-fridge-300 hover:border-fridge-400"
          )}
        >
          {item.isChecked && <Check className="h-4 w-4" />}
        </button>
        <span className={`transition-all ${item.isChecked ? "line-through text-gray-500" : "text-gray-700"}`}>
          {item.name}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-sm bg-fridge-50 px-2.5 py-1 rounded-full text-fridge-600 mr-3 font-medium">{item.quantity}</span>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.li>
  );
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

export default ShoppingList;
