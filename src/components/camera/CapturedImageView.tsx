
import { motion } from "framer-motion";
import AnalyzingOverlay from "./AnalyzingOverlay";
import DetectedIngredients from "./DetectedIngredients";

interface CapturedImageViewProps {
  imageSrc: string;
  isAnalyzing: boolean;
  detectedIngredients: string[];
  onRetake: () => void;
  onSave: () => void;
}

const CapturedImageView: React.FC<CapturedImageViewProps> = ({
  imageSrc,
  isAnalyzing,
  detectedIngredients,
  onRetake,
  onSave,
}) => {
  return (
    <motion.div 
      key="result"
      className="h-full w-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex-1">
        <img 
          src={imageSrc} 
          alt="Captured" 
          className="h-full w-full object-cover" 
        />
        {isAnalyzing && <AnalyzingOverlay />}
      </div>
      
      <DetectedIngredients 
        ingredients={detectedIngredients}
        isAnalyzing={isAnalyzing}
        onRetake={onRetake}
        onSave={onSave}
      />
    </motion.div>
  );
};

export default CapturedImageView;
