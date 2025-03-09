
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Camera } from "@/components/camera";

const CameraView = () => {
  const navigate = useNavigate();
  
  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);
  
  return (
    <motion.div 
      className="h-screen w-full relative flex flex-col bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Camera onClose={handleBack} />
    </motion.div>
  );
};

export default CameraView;
