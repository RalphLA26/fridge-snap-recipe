import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search, ShoppingBag, Archive, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryItemsList from "@/components/InventoryItemsList";
import InventoryStatistics from "@/components/InventoryStatistics";
import { useUser } from "@/contexts/UserContext";
import { getExpiryStatus } from "@/lib/inventoryUtils";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  expiryDate?: string;
  addedAt: string;
}

const DEFAULT_CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Pantry",
  "Frozen",
  "Beverages",
  "Spices & Condiments",
  "Other"
];

const QUANTITY_UNITS = [
  "pcs", "g", "kg", "ml", "L", "tbsp", "tsp", "cup", "oz", "lb", "bunch", "can", "bottle", "box", "package"
];

const InventoryView = () => {
  const navigate = useNavigate();
  const { addToShoppingList } = useUser();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [newUnit, setNewUnit] = useState("pcs");
  const [selectedCategory, setSelectedCategory] = useState("Pantry");
  const [expiryDate, setExpiryDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showStats, setShowStats] = useState(false);
  
  // Load saved inventory from localStorage on initial render
  useEffect(() => {
    const savedInventory = localStorage.getItem("fridgeInventory");
    if (savedInventory) {
      setInventoryItems(JSON.parse(savedInventory));
    }
  }, []);
  
  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fridgeInventory", JSON.stringify(inventoryItems));
  }, [inventoryItems]);
  
  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    
    const newInventoryItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      quantity: newQuantity || "1",
      unit: newUnit,
      category: selectedCategory,
      ...(expiryDate && { expiryDate }),
      addedAt: new Date().toISOString()
    };
    
    setInventoryItems(prev => [...prev, newInventoryItem]);
    setNewItem("");
    setNewQuantity("1");
    setExpiryDate("");
    toast.success(`${newItem} added to inventory`);
  };
  
  const handleRemoveItem = (id: string) => {
    const itemToRemove = inventoryItems.find(item => item.id === id);
    setInventoryItems(prev => prev.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from inventory`);
    }
  };
  
  const handleAddToShoppingList = (item: InventoryItem) => {
    addToShoppingList({
      name: item.name,
      quantity: `${item.quantity} ${item.unit}`,
      isChecked: false
    });
    toast.success(`${item.name} added to shopping list`);
  };
  
  const handleUpdateQuantity = (id: string, newQuantity: string, newUnit?: string) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === id ? {
        ...item, 
        quantity: newQuantity,
        ...(newUnit && { unit: newUnit })
      } : item)
    );
  };

  const handleUpdateExpiryDate = (id: string, newExpiryDate: string) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === id ? {
        ...item, 
        expiryDate: newExpiryDate
      } : item)
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };
  
  // Filter items based on search query and active tab
  const getFilteredItems = () => {
    let filtered = inventoryItems;
    
    // First apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Then apply category filter if not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.category === activeTab);
    }
    
    // Sort by expiry date (items expiring sooner first), then by newest
    return filtered.sort((a, b) => {
      // If both have expiry dates, sort by expiry date (soonest first)
      if (a.expiryDate && b.expiryDate) {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      
      // If only one has expiry date, it goes first
      if (a.expiryDate) return -1;
      if (b.expiryDate) return 1;
      
      // Otherwise sort by newest first
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  };
  
  const filteredItems = getFilteredItems();
  
  // Calculate expiring soon and expired counts
  const expiryStats = useMemo(() => {
    const today = new Date();
    let expiringSoon = 0;
    let expired = 0;
    
    inventoryItems.forEach(item => {
      if (item.expiryDate) {
        const status = getExpiryStatus(item.expiryDate);
        if (status === 'expired') expired++;
        else if (status === 'expiring-soon') expiringSoon++;
      }
    });
    
    return { expiringSoon, expired };
  }, [inventoryItems]);
  
  // Calculate item counts by category
  const itemCountByCategory = useMemo(() => {
    return DEFAULT_CATEGORIES.reduce((acc, category) => {
      acc[category] = inventoryItems.filter(item => item.category === category).length;
      return acc;
    }, {} as Record<string, number>);
  }, [inventoryItems]);
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">My Inventory</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="text-fridge-600 border-fridge-200 hover:bg-fridge-50"
            >
              <BarChart className="h-4 w-4 mr-1.5" />
              {showStats ? "Hide" : "Show"} Stats
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/shopping-list")}
              className="text-fridge-600 border-fridge-200 hover:bg-fridge-50"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              Shopping List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/camera")}
              className="text-fridge-600 border-fridge-200 hover:bg-fridge-50"
            >
              <Archive className="h-4 w-4 mr-1.5" />
              Scan Items
            </Button>
          </div>
        </div>
        
        {showStats && inventoryItems.length > 0 && (
          <InventoryStatistics 
            items={inventoryItems} 
            categoryCounts={itemCountByCategory}
            expiryStats={expiryStats}
          />
        )}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add new item to inventory..."
                className="flex-1"
              />
              <Button 
                onClick={handleAddItem}
                className="bg-fridge-600 hover:bg-fridge-700 text-white"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-1/4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3 sm:w-1/6">
                <Input
                  type="text"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-full"
                />
              </div>
              <div className="w-1/3 sm:w-1/6">
                <Select value={newUnit} onValueChange={setNewUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUANTITY_UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3 sm:w-1/3">
                <Input
                  type="date"
                  placeholder="Expiry date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {inventoryItems.length > 0 && (
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
          
          {inventoryItems.length > 0 ? (
            <div>
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All ({inventoryItems.length})
                  </TabsTrigger>
                  {DEFAULT_CATEGORIES.slice(0, 3).map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs sm:text-sm"
                    >
                      {category.split(' ')[0]} ({itemCountByCategory[category] || 0})
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-2">
                  <InventoryItemsList 
                    items={filteredItems}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateExpiryDate={handleUpdateExpiryDate}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                </TabsContent>
                
                {DEFAULT_CATEGORIES.map(category => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-2">
                    <InventoryItemsList 
                      items={filteredItems}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                      onUpdateExpiryDate={handleUpdateExpiryDate}
                      onAddToShoppingList={handleAddToShoppingList}
                    />
                  </TabsContent>
                ))}
              </Tabs>
              
              {filteredItems.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items match your search</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Your inventory is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add ingredients or scan items with your camera</p>
            </div>
          )}
          
          {inventoryItems.length > 0 && filteredItems.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''} in inventory
                {expiryStats.expiringSoon > 0 && (
                  <span className="ml-2 text-amber-600">
                    • {expiryStats.expiringSoon} expiring soon
                  </span>
                )}
                {expiryStats.expired > 0 && (
                  <span className="ml-2 text-red-600">
                    • {expiryStats.expired} expired
                  </span>
                )}
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
