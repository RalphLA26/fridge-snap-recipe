
import { useState } from "react";
import { Plus, X, Check, ShoppingBag, Trash2, ArrowUpDown, ListFilter, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingItem, useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type SortOption = "added" | "alphabetical" | "checked";

const ShoppingList = () => {
  const { user, addToShoppingList, removeFromShoppingList, toggleShoppingItem, clearShoppingList } = useUser();
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("added");
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);

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

  const handleDeliveryApp = (app: string) => {
    // Get unchecked items for the delivery
    const itemsToDeliver = user?.shoppingList.filter(item => !item.isChecked) || [];
    
    if (itemsToDeliver.length === 0) {
      toast.error("No items to deliver. Add items or uncheck some items first.");
      return;
    }
    
    // Create a shopping list string
    const shoppingListText = itemsToDeliver.map(item => `${item.quantity} x ${item.name}`).join(", ");
    
    // Handle different delivery apps
    let url = "";
    let appName = "";
    
    switch(app) {
      case "instacart":
        url = `https://www.instacart.com/store/search_v3/term?term=${encodeURIComponent(shoppingListText)}`;
        appName = "Instacart";
        break;
      case "doordash":
        url = `https://www.doordash.com/search/store/${encodeURIComponent(shoppingListText)}`;
        appName = "DoorDash";
        break;
      case "ubereats":
        url = `https://www.ubereats.com/search?q=${encodeURIComponent(shoppingListText)}`;
        appName = "Uber Eats";
        break;
      case "walmart":
        url = `https://www.walmart.com/search?q=${encodeURIComponent(shoppingListText)}`;
        appName = "Walmart";
        break;
    }
    
    // Open the URL in a new tab
    window.open(url, "_blank");
    
    toast.success(`Opening ${appName} with your shopping list`);
    setShowDeliveryDialog(false);
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

  const sortedItems = user?.shoppingList ? sortItems(user.shoppingList) : [];
  const hasItems = sortedItems.length > 0;

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
          <div className="flex space-x-2">
            {hasItems && (
              <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-fridge-600 border-fridge-300">
                    <Truck className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Delivery</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Get items delivered</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Choose a delivery service to get your shopping list items delivered:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleDeliveryApp("instacart")}
                        className="h-16 flex flex-col gap-1"
                      >
                        <span className="text-xs">Instacart</span>
                      </Button>
                      <Button 
                        onClick={() => handleDeliveryApp("doordash")}
                        className="h-16 flex flex-col gap-1"
                      >
                        <span className="text-xs">DoorDash</span>
                      </Button>
                      <Button 
                        onClick={() => handleDeliveryApp("ubereats")}
                        className="h-16 flex flex-col gap-1"
                      >
                        <span className="text-xs">Uber Eats</span>
                      </Button>
                      <Button 
                        onClick={() => handleDeliveryApp("walmart")}
                        className="h-16 flex flex-col gap-1"
                      >
                        <span className="text-xs">Walmart</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: Only unchecked items will be included in your delivery order.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600">
                  <ListFilter className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("added")}>
                  Most Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("checked")}>
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
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
          </div>
        </div>
        
        {!hasItems ? (
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
              {sortedItems.map((item) => (
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
