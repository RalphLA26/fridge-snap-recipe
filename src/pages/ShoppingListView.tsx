
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, Share2, Tag, ListChecks, Search, Store, MapPin, ShoppingCart, Receipt, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingList from "@/components/ShoppingList";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { findNearbyStores, GroceryStore } from "@/lib/groceryStoreLocator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ShoppingListView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [nearbyStores, setNearbyStores] = useState<GroceryStore[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  
  // Load nearby stores
  useEffect(() => {
    const loadStores = async () => {
      setIsLoadingStores(true);
      try {
        const stores = await findNearbyStores();
        setNearbyStores(stores);
      } catch (error) {
        console.error("Error loading stores:", error);
      } finally {
        setIsLoadingStores(false);
      }
    };
    
    loadStores();
  }, []);
  
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
  };
  
  const handleShareList = () => {
    if (!user?.shoppingList.length) {
      toast.error("Your shopping list is empty. Add items first.");
      return;
    }
    
    const listText = user.shoppingList
      .map(item => `${item.quantity} x ${item.name}${item.isChecked ? " ✓" : ""}`)
      .join("\n");
    
    if (navigator.share) {
      navigator.share({
        title: "My Shopping List",
        text: listText
      }).then(() => {
        toast.success("Shopping list shared successfully");
      }).catch((error) => {
        console.error("Error sharing", error);
        fallbackShare(listText);
      });
    } else {
      fallbackShare(listText);
    }
  };
  
  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Shopping list copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy list to clipboard");
    });
  };
  
  const totalItems = user?.shoppingList.length || 0;
  const checkedItems = user?.shoppingList.filter(item => item.isChecked).length || 0;
  const hasUncheckedItems = (user?.shoppingList.filter(item => !item.isChecked).length || 0) > 0;
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
            Shopping List
            {totalItems > 0 && (
              <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 px-2.5 py-0.5 rounded-full font-normal">
                {checkedItems}/{totalItems}
              </span>
            )}
          </h1>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareList}
              className="hover:bg-gray-100 rounded-full"
              title="Share list"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4 pb-16">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              My List
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Nearby Stores
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 pt-5 pb-6">
                <ShoppingList hideDeliveryButton={true} />
              </div>
            </Card>
            
            {user?.shoppingList.filter(item => !item.isChecked).length === 0 && user?.shoppingList.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800 flex items-start"
              >
                <ListChecks className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">All items are purchased!</p>
                  <p className="text-green-600 text-xs mt-1">Your shopping list is complete. Add more items or uncheck items to use delivery services.</p>
                </div>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="stores" className="mt-0 space-y-4">
            {hasUncheckedItems && (
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-fridge-50/50">
                  <h3 className="font-medium text-fridge-800 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-fridge-600" />
                    Nearby Grocery Stores
                  </h3>
                </div>
                
                <div className="p-4">
                  {isLoadingStores ? (
                    <StoresLoadingState />
                  ) : nearbyStores.length > 0 ? (
                    <div className="space-y-3">
                      {nearbyStores.map(store => (
                        <StoreCard key={store.id} store={store} />
                      ))}
                    </div>
                  ) : (
                    <EmptyStoresState />
                  )}
                </div>
              </Card>
            )}
            
            {hasUncheckedItems && (
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-fridge-50/50">
                  <h3 className="font-medium text-fridge-800 flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-fridge-600" />
                    Delivery Options
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Send your unchecked items to a delivery service
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <DeliveryButton
                      onClick={() => handleDeliveryApp("instacart")}
                      name="Instacart"
                      icon="🛒"
                      description="Groceries & more"
                    />
                    <DeliveryButton
                      onClick={() => handleDeliveryApp("doordash")}
                      name="DoorDash"
                      icon="🚚"
                      description="Delivery service"
                    />
                    <DeliveryButton
                      onClick={() => handleDeliveryApp("ubereats")}
                      name="Uber Eats"
                      icon="🥡"
                      description="Food delivery"
                    />
                    <DeliveryButton
                      onClick={() => handleDeliveryApp("walmart")}
                      name="Walmart"
                      icon="🏪"
                      description="Online shopping"
                    />
                  </div>
                  
                  <div className="flex items-center mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <Tag className="h-3 w-3 mr-1 text-fridge-400 flex-shrink-0" />
                    Only unchecked items will be included in your delivery
                  </div>
                </div>
              </Card>
            )}
            
            {!hasUncheckedItems && user?.shoppingList.length > 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <ListChecks className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">All Done Shopping!</h3>
                <p className="text-sm text-green-600 max-w-md mb-6">
                  You've purchased all items on your list. Great job!
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                  <Button onClick={() => setActiveTab("list")} className="bg-fridge-600 hover:bg-fridge-700 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    View List
                  </Button>
                </div>
              </div>
            )}
            
            {!user?.shoppingList.length && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="bg-fridge-100 p-4 rounded-full mb-4">
                  <ShoppingBag className="h-10 w-10 text-fridge-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Shopping List is Empty</h3>
                <p className="text-sm text-gray-600 max-w-md mb-6">
                  Add items to your list to see nearby stores and delivery options.
                </p>
                <Button onClick={() => setActiveTab("list")} className="bg-fridge-600 hover:bg-fridge-700">
                  Start Shopping List
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </motion.div>
  );
};

// Loading state for stores
const StoresLoadingState = () => (
  <div className="text-center py-6">
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-fridge-500 border-r-transparent"></div>
    <p className="mt-3 text-sm text-gray-500">Finding stores near you...</p>
  </div>
);

// Empty state for stores
const EmptyStoresState = () => (
  <div className="text-center py-6">
    <Store className="h-10 w-10 mx-auto text-gray-300 mb-2" />
    <p className="text-gray-600 font-medium">No stores found nearby</p>
    <p className="text-sm text-gray-500 mt-1">Try again later or use a delivery service</p>
  </div>
);

// Store card component
const StoreCard = ({ store }: { store: GroceryStore }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
  >
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-medium">{store.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{store.address}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm bg-fridge-50 px-2 py-0.5 rounded-full text-fridge-600 font-medium">
          {store.distance} mi
        </span>
        <span className="text-xs text-gray-400 mt-1">Open now</span>
      </div>
    </div>
  </motion.div>
);

// Delivery button component for cleaner UI
const DeliveryButton = ({ 
  onClick, 
  name, 
  icon, 
  description 
}: { 
  onClick: () => void, 
  name: string, 
  icon: string, 
  description: string 
}) => {
  return (
    <Button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50 hover:border-fridge-200 hover:text-fridge-800 transition-all shadow-sm hover:shadow-md rounded-xl h-auto py-3"
      variant="outline"
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-gray-500">{description}</span>
    </Button>
  );
};

export default ShoppingListView;
