
import { useNavigate } from "react-router-dom";
import { Camera, Utensils, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCameraClick = () => {
    navigate("/camera");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-fridge-100 via-white to-fridge-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          className="w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-8 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fridge-700 to-fridge-500 bg-clip-text text-transparent mb-3">
              FridgeSnap
            </h1>
            <p className="text-gray-600 text-lg">
              Turn your ingredients into delicious meals
            </p>
          </motion.div>
          
          <motion.div
            className="space-y-5"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="overflow-hidden bg-white rounded-2xl shadow-lg"
            >
              <Button
                onClick={handleCameraClick}
                className="w-full py-10 rounded-xl bg-gradient-to-r from-fridge-600 to-fridge-500 hover:from-fridge-700 hover:to-fridge-600 text-white border-none"
                type="button"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-white/20 rounded-full">
                    <Camera className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-2xl font-semibold">Scan My Fridge</span>
                </div>
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden bg-white rounded-xl shadow-md"
              >
                <Button
                  onClick={() => navigate("/recipes")}
                  variant="ghost"
                  className="w-full h-full py-6 flex flex-col items-center justify-center gap-2 bg-recipe-50 hover:bg-recipe-100 text-recipe-800"
                >
                  <Utensils className="w-8 h-8" strokeWidth={1.5} />
                  <span className="font-medium">Recipes</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden bg-white rounded-xl shadow-md"
              >
                <Button
                  onClick={() => navigate("/shopping-list")}
                  variant="ghost"
                  className="w-full h-full py-6 flex flex-col items-center justify-center gap-2 bg-fridge-50 hover:bg-fridge-100 text-fridge-800"
                >
                  <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
                  <span className="font-medium">Shopping</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.p 
            className="mt-8 text-sm text-gray-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Take a photo of your ingredients and let us suggest perfect recipes for you.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
