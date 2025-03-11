import { useState, useCallback, useEffect } from "react";
import { Plus, X, Check, ShoppingBag, Trash2, ListFilter, Search, ListChecks, SlidersHorizontal, CheckCircle2, Tag, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingItem, useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type SortOption = "added" | "alphabetical" | "checked" | "category";

interface ShoppingListProps {
  hideDeliveryButton?: boolean;
}

// Common categories for shopping items
const CATEGORIES = [
  { id: "produce", name: "Produce", emoji: "🥬" },
  { id: "dairy", name: "Dairy", emoji: "🥛" },
  { id: "meat", name: "Meat & Seafood", emoji: "🥩" },
  { id: "bakery", name: "Bakery", emoji: "🍞" },
  { id: "pantry", name: "Pantry", emoji: "🥫" },
  { id: "frozen", name: "Frozen Foods", emoji: "❄️" },
  { id: "beverages", name: "Beverages", emoji: "🥤" },
  { id: "snacks", name: "Snacks", emoji: "🍿" },
  { id: "other", name: "Other", emoji: "📦" }
];

// Helper to guess item category based on common items
const guessCategory = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();
  
  const categoryMatches = {
    produce: ["apple", "banana", "lettuce", "tomato", "pepper", "onion", "garlic", "potato", "carrot", "broccoli", "fruit", "vegetable"],
    dairy: ["milk", "cheese", "yogurt", "butter", "cream", "egg"],
    meat: ["chicken", "beef", "pork", "fish", "shrimp", "salmon", "steak", "ground", "meat", "sausage"],
    bakery: ["bread", "bagel", "roll", "cake", "muffin", "pastry", "dough"],
    pantry: ["pasta", "rice", "bean", "can", "sauce", "oil", "vinegar", "spice", "flour", "sugar", "cereal"],
    frozen: ["frozen", "ice cream", "pizza", "fries"],
    beverages: ["water", "juice", "soda", "coffee", "tea", "beer", "wine"],
    snacks: ["chip", "cookie", "cracker", "popcorn", "pretzel", "nut", "chocolate", "candy"]
  };

  for (const [category, keywords] of Object.entries(categoryMatches)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  return "other";
};

const ShoppingList = ({ hideDeliveryButton = false }: ShoppingListProps) => {
  const { user, addToShoppingList, removeFromShoppingList, toggleShoppingItem, clearShoppingList } = useUser();
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newCategory, setNewCategory] = useState("other");
  const [sortOption, setSortOption] = useState<SortOption>("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowForm(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-detect category when item name changes
  useEffect(() => {
    if (newItem.trim()) {
      setNewCategory(guessCategory(newItem));
    }
  }, [newItem]);

  const handleAddItem = useCallback(() => {
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    addToShoppingList({
      name: newItem.trim(),
      quantity: newQuantity.trim() || "1",
      isChecked: false,
      category: newCategory || "other",
    });

    setNewItem("");
    setNewQuantity("");
    if (isMobile) {
      setShowForm(false); // Hide form after adding on mobile
    }
    toast.success("Item added to shopping list");
  }, [newItem, newQuantity, newCategory, addToShoppingList, isMobile]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const sortItems = (items: ShoppingItem[]): ShoppingItem[] => {
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
      case "category":
        return itemsCopy.sort((a, b) => {
          // First by checked status
          if (a.isChecked !== b.isChecked) {
            return a.isChecked ? 1 : -1;
          }
          // Then by category
          if ((a.category || "other") !== (b.category || "other")) {
            return (a.category || "other").localeCompare(b.category || "other");
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

  // Group items by checked status first, then by category
  const groupedItems = filteredItems.reduce<Record<string, ShoppingItem[]>>((groups, item) => {
    const statusKey = item.isChecked ? "checked" : "unchecked";
    const categoryKey = item.category || "other";
    
    // Initialize category group if it doesn't exist
    if (!groups[`${statusKey}-${categoryKey}`]) {
      groups[`${statusKey}-${categoryKey}`] = [];
    }
    
    groups[`${statusKey}-${categoryKey}`].push(item);
    return groups;
  }, {});

  // Get category groups for unchecked and checked items
  const uncheckedGroups = Object.entries(groupedItems)
    .filter(([key]) => key.startsWith("unchecked-"))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  const checkedGroups = Object.entries(groupedItems)
    .filter(([key]) => key.startsWith("checked-"))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  // Get category name and emoji
  const getCategoryInfo = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category || { name: "Other", emoji: "📦" };
  };

  return (
    <div className="space-y-4">
      {/* Mobile add button - only visible on mobile when form is hidden */}
      {isMobile && !showForm && (
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl bg-gradient-to-r from-fridge-600 to-fridge-700 hover:from-fridge-700 hover:to-fridge-800 text-white transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Item to Shopping List</span>
        </Button>
      )}
      
      {/* Input area with improved styling */}
      <AnimatePresence>
        {(showForm || !isMobile) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-4 border border-fridge-100 shadow-md bg-gradient-to-r from-white to-fridge-50/40">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Plus className="h-4 w-4 mr-1.5 text-fridge-600" />
                    Add New Item
                  </h3>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      className="h-7 w-7 p-0 rounded-full hover:bg-fridge-100"
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
                      className="border-fridge-100 focus:border-fridge-400 focus-ring shadow-sm"
                      placeholder="Enter item name..."
                    />
                  </div>
                  <div className="flex-initial w-full md:w-24">
                    <Input
                      type="text"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="border-fridge-100 focus:border-fridge-400 focus-ring shadow-sm"
                      placeholder="Qty"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto border-fridge-100 text-gray-700 hover:bg-fridge-50 shadow-sm">
                        <Tag className="h-4 w-4 mr-2 text-fridge-600" />
                        <span className="truncate">
                          {getCategoryInfo(newCategory).emoji} {getCategoryInfo(newCategory).name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-md border border-fridge-100">
                      {CATEGORIES.map((category) => (
                        <DropdownMenuItem 
                          key={category.id}
                          onClick={() => setNewCategory(category.id)}
                          className={cn(
                            "hover:bg-fridge-50 cursor-pointer",
                            newCategory === category.id && "bg-fridge-50 text-fridge-700"
                          )}
                        >
                          <span className="mr-2">{category.emoji}</span>
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    onClick={handleAddItem}
                    className="h-10 rounded-lg bg-gradient-to-r from-fridge-600 to-fridge-700 hover:from-fridge-700 hover:to-fridge-800 text-white w-full md:w-auto transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    <span>Add Item</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Shopping list area */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
            Your Shopping List 
            {hasItems && (
              <span className="ml-2 px-2.5 py-0.5 text-sm bg-gradient-to-r from-fridge-50 to-fridge-100 text-fridge-700 rounded-full font-medium shadow-sm">
                {itemsLeft} left, {completedItems} purchased
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600 hover:bg-fridge-50 border-fridge-100 shadow-sm">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-md border border-fridge-100">
                <DropdownMenuItem 
                  onClick={() => setSortOption("category")} 
                  className={cn("hover:bg-fridge-50", sortOption === "category" && "bg-fridge-50 text-fridge-700")}
                >
                  By Category
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOption("alphabetical")} 
                  className={cn("hover:bg-fridge-50", sortOption === "alphabetical" && "bg-fridge-50 text-fridge-700")}
                >
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOption("checked")} 
                  className={cn("hover:bg-fridge-50", sortOption === "checked" && "bg-fridge-50 text-fridge-700")}
                >
                  Unchecked First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOption("added")} 
                  className={cn("hover:bg-fridge-50", sortOption === "added" && "bg-fridge-50 text-fridge-700")}
                >
                  Most Recently Added
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
                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-fridge-100 shadow-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
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
              className="pl-10 bg-gray-50 border-fridge-100 focus-ring shadow-sm"
            />
          </div>
        )}
        
        {!hasItems ? (
          <EmptyListState />
        ) : filteredItems.length === 0 ? (
          <EmptySearchState />
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Unchecked items by category */}
            {uncheckedGroups.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1.5 text-fridge-600" />
                  Items to Purchase ({itemsLeft})
                </h4>
                
                <div className="space-y-5">
                  {uncheckedGroups.map(([key, items]) => {
                    const categoryId = key.split('-')[1];
                    const { name, emoji } = getCategoryInfo(categoryId);
                    
                    return (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-fridge-50 to-fridge-100 shadow-sm mr-2">
                            <span className="text-base">{emoji}</span>
                          </div>
                          <span>{name}</span>
                          <span className="ml-2 text-xs bg-fridge-100 text-fridge-700 px-2 py-0.5 rounded-full font-medium shadow-sm">
                            {items.length}
                          </span>
                        </div>
                        
                        <motion.ul 
                          className="space-y-2.5"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <AnimatePresence>
                            {items.map((item) => (
                              <ShoppingListItem 
                                key={item.id} 
                                item={item} 
                                onToggle={() => toggleShoppingItem(item.id)}
                                onRemove={() => removeFromShoppingList(item.id)}
                                categoryEmoji={emoji}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.ul>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {/* Checked items by category */}
            {checkedGroups.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="pt-3 border-t border-fridge-100"
              >
                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
                  Purchased Items ({completedItems})
                </h4>
                
                <div className="space-y-5">
                  {checkedGroups.map(([key, items]) => {
                    const categoryId = key.split('-')[1];
                    const { name, emoji } = getCategoryInfo(categoryId);
                    
                    return (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center text-sm font-medium text-gray-400 mb-1">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 mr-2">
                            <span className="text-base">{emoji}</span>
                          </div>
                          <span>{name}</span>
                          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            {items.length}
                          </span>
                        </div>
                        
                        <motion.ul 
                          className="space-y-2.5"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <AnimatePresence>
                            {items.map((item) => (
                              <ShoppingListItem 
                                key={item.id} 
                                item={item} 
                                onToggle={() => toggleShoppingItem(item.id)}
                                onRemove={() => removeFromShoppingList(item.id)}
                                categoryEmoji={emoji}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.ul>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Extracted shopping list item component
const ShoppingListItem = ({ 
  item, 
  onToggle, 
  onRemove,
  categoryEmoji = "📦"
}: { 
  item: ShoppingItem; 
  onToggle: () => void; 
  onRemove: () => void;
  categoryEmoji?: string;
}) => {
  return (
    <motion.li 
      variants={itemVariants}
      exit="exit"
      className={cn(
        "flex items-center justify-between py-3.5 px-4 rounded-xl shadow-sm border transform transition-all duration-300 hover:shadow group",
        item.isChecked 
          ? "border-green-200 bg-gradient-to-r from-green-50 to-white" 
          : "border-fridge-100 bg-gradient-to-r from-white to-fridge-50/30"
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center h-7 w-7 rounded-full mr-3.5 flex-shrink-0 transition-all duration-300",
            item.isChecked 
              ? "bg-green-500 text-white shadow-sm" 
              : "border-2 border-fridge-300 hover:border-fridge-400 group-hover:border-fridge-500"
          )}
          aria-label={item.isChecked ? "Mark as not purchased" : "Mark as purchased"}
        >
          {item.isChecked ? (
            <Check className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4 text-transparent" /> 
          )}
        </button>
        <div className="flex flex-col min-w-0">
          <span className={cn("transition-all font-medium", 
            item.isChecked ? "line-through text-gray-500" : "text-gray-700"
          )}>
            {item.name}
          </span>
          {item.category && (
            <span className="text-xs text-gray-400 flex items-center mt-0.5">
              <span className="mr-1">{categoryEmoji}</span>
              <span className="truncate">{item.quantity}</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center ml-2">
        <span className={cn("text-sm px-2.5 py-0.5 rounded-full font-medium transition-all",
          item.isChecked ? "bg-gray-100 text-gray-500" : "bg-fridge-100 text-fridge-700"
        )}>{item.quantity}</span>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
          aria-label="Remove item"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.li>
  );
};

// Empty state component
const EmptyListState = () => (
  <div className="text-center py-12 bg-gradient-to-b from-fridge-50/80 to-white rounded-xl border border-fridge-100/80 shadow-sm">
    <div className="bg-white p-4 rounded-full inline-flex items-center justify-center shadow-md mb-4">
      <ShoppingBag className="h-12 w-12 text-fridge-300" />
    </div>
    <p className="text-gray-700 mb-2 font-medium text-lg">Your shopping list is empty</p>
    <p className="text-sm text-gray-500 max-w-xs mx-auto">Add items above to start building your shopping list</p>
  </div>
);

// Empty search state component
const EmptySearchState = () => (
  <div className="text-center py-10 bg-gradient-to-b from-fridge-50/80 to-white rounded-xl border border-fridge-100/80 shadow-sm">
    <div className="bg-white p-3 rounded-full inline-flex items-center justify-center shadow-md mb-3">
      <Search className="h-8 w-8 text-gray-300" />
    </div>
    <p className="text-gray-700 font-medium">No items match your search</p>
    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Try a different search term or check your spelling</p>
  </div>
);

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
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  },
};

export default ShoppingList;
