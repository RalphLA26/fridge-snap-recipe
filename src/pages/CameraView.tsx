
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "@/components/camera";

const CameraView = () => {
  const navigate = useNavigate();
  
  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);
  
  return (
    <motion.div 
      className="h-full w-full fixed inset-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Camera onClose={handleBack} />
    </motion.div>
  );
};

export default CameraView;
