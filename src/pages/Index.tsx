
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCameraClick = () => {
    navigate("/camera");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          className="w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-blue-700 mb-3">FridgeSnap</h1>
            <p className="text-gray-600 text-lg">
              Discover recipes from your fridge ingredients
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="shadow-lg rounded-2xl overflow-hidden bg-white p-2"
          >
            <Button
              onClick={handleCameraClick}
              className="w-full py-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              type="button"
            >
              <motion.div 
                className="flex items-center justify-center gap-4"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="p-3 bg-white/20 rounded-full">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <span className="text-2xl font-semibold">Scan My Fridge</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.p 
            className="mt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Simply snap a photo of your fridge and let us find delicious recipes for you.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
