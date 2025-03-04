
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, Store, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingList from "@/components/ShoppingList";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const ShoppingListView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  
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
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
            Shopping List
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShareList}
            className="hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4 space-y-6">
        <Tabs defaultValue="store" className="w-full">
          <div className="bg-white rounded-t-xl shadow-sm p-2 border border-gray-100 flex justify-center">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="store" className="data-[state=active]:bg-fridge-50 data-[state=active]:text-fridge-700">
                <Store className="h-4 w-4 mr-2" />
                Shop In-Store
              </TabsTrigger>
              <TabsTrigger value="delivery" className="data-[state=active]:bg-fridge-50 data-[state=active]:text-fridge-700">
                <Truck className="h-4 w-4 mr-2" />
                Get Delivery
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="store" className="bg-white rounded-b-xl shadow-sm p-5 border border-gray-100 border-t-0 mt-0">
            <ShoppingList hideDeliveryButton={true} />
          </TabsContent>
          
          <TabsContent value="delivery" className="bg-white rounded-b-xl shadow-sm p-5 border border-gray-100 border-t-0 mt-0">
            <div className="space-y-4">
              <div className="text-center p-3 bg-fridge-50 rounded-lg border border-fridge-100">
                <h3 className="font-medium text-fridge-800 mb-1">Get your groceries delivered</h3>
                <p className="text-sm text-gray-600 mb-3">Select a delivery service to get your shopping list items delivered to your door.</p>
                
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <Button 
                    onClick={() => handleDeliveryApp("instacart")}
                    className="h-16 flex flex-col gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50"
                    variant="outline"
                  >
                    <span className="text-sm font-medium">Instacart</span>
                  </Button>
                  <Button 
                    onClick={() => handleDeliveryApp("doordash")}
                    className="h-16 flex flex-col gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50"
                    variant="outline"
                  >
                    <span className="text-sm font-medium">DoorDash</span>
                  </Button>
                  <Button 
                    onClick={() => handleDeliveryApp("ubereats")}
                    className="h-16 flex flex-col gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50"
                    variant="outline"
                  >
                    <span className="text-sm font-medium">Uber Eats</span>
                  </Button>
                  <Button 
                    onClick={() => handleDeliveryApp("walmart")}
                    className="h-16 flex flex-col gap-1 bg-white border border-gray-200 text-gray-800 hover:bg-fridge-50"
                    variant="outline"
                  >
                    <span className="text-sm font-medium">Walmart</span>
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Note: Only unchecked items will be included in your delivery order.
                </p>
              </div>
              
              <ShoppingList hideDeliveryButton={true} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </motion.div>
  );
};

export default ShoppingListView;
