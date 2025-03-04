
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingList from "@/components/ShoppingList";

const ShoppingListView = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Shopping List</h1>
          <div className="w-10"></div> {/* Empty div for spacing */}
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4 space-y-6">
        <ShoppingList />
      </main>
    </motion.div>
  );
};

export default ShoppingListView;
