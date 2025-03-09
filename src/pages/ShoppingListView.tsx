
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, Share2, Check, Tag, ListChecks, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import ShoppingList from "@/components/ShoppingList";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { findNearbyStores, GroceryStore } from "@/lib/groceryStoreLocator";

const ShoppingListView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [nearbyStores, setNearbyStores] = useState<GroceryStore[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  
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
          <div className="flex">
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
      
      <main className="container max-w-xl mx-auto p-4 space-y-6 pb-16">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-gradient-to-b from-white to-fridge-50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="space-y-4">
                {/* Shopping list first */}
                <div className="px-5 pt-5">
                  <ShoppingList hideDeliveryButton={true} />
                </div>
                
                {/* Nearby stores section */}
                {user?.shoppingList.filter(item => !item.isChecked).length > 0 && (
                  <div className="p-5 bg-fridge-50/50 border-t border-fridge-100">
                    <h3 className="font-medium text-fridge-800 mb-3 flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Nearby Grocery Stores
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      {isLoadingStores ? (
                        <div className="text-center py-3">
                          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-fridge-500 border-r-transparent"></div>
                          <p className="mt-2 text-sm text-gray-500">Finding stores near you...</p>
                        </div>
                      ) : nearbyStores.length > 0 ? (
                        nearbyStores.map(store => (
                          <div key={store.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow transition-all">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{store.name}</h4>
                                <p className="text-xs text-gray-500">{store.address}</p>
                              </div>
                              <span className="text-sm bg-fridge-50 px-2 py-0.5 rounded-full text-fridge-600">
                                {store.distance} mi
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-3 text-gray-500 text-sm">
                          No stores found nearby
                        </div>
                      )}
                    </div>
                    
                    {/* Delivery options section */}
                    <h3 className="font-medium text-fridge-800 mb-2 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Delivery Options
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Send your unchecked items to a delivery service
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <DeliveryButton
                        onClick={() => handleDeliveryApp("instacart")}
                        name="Instacart"
                        icon="🛒"
                      />
                      <DeliveryButton
                        onClick={() => handleDeliveryApp("doordash")}
                        name="DoorDash"
                        icon="🚚"
                      />
                      <DeliveryButton
                        onClick={() => handleDeliveryApp("ubereats")}
                        name="Uber Eats"
                        icon="🥡"
                      />
                      <DeliveryButton
                        onClick={() => handleDeliveryApp("walmart")}
                        name="Walmart"
                        icon="🏪"
                      />
                    </div>
                    
                    <div className="flex items-center mt-4 text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
                      <Tag className="h-3 w-3 mr-1 text-fridge-400 flex-shrink-0" />
                      Only unchecked items will be included in your delivery
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {user?.shoppingList.filter(item => !item.isChecked).length === 0 && user?.shoppingList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800 flex items-start max-w-md mx-auto"
          >
            <ListChecks className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">All items are purchased!</p>
              <p className="text-green-600 text-xs mt-1">Your shopping list is complete. Add more items or uncheck items to use delivery services.</p>
            </div>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
};

// Delivery button component for cleaner UI
const DeliveryButton = ({ onClick, name, icon }: { onClick: () => void, name: string, icon: string }) => {
  return (
    <Button 
      onClick={onClick}
      className="h-16 flex flex-col gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50 hover:border-fridge-200 hover:text-fridge-800 transition-all shadow-sm hover:shadow rounded-xl"
      variant="outline"
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-medium">{name}</span>
    </Button>
  );
};

export default ShoppingListView;
