
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
    <div className="min-h-screen bg-gradient-to-b from-fridge-50 to-white">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">FridgeSnap</h1>
            <p className="text-gray-600">
              Scan your fridge and discover recipes
            </p>
          </div>
          
          <Button
            onClick={handleCameraClick}
            className="w-full py-8 text-xl flex items-center justify-center gap-3 bg-fridge-500 hover:bg-fridge-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            type="button"
          >
            <Camera className="w-8 h-8 text-white" />
            <span>Scan My Fridge</span>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
