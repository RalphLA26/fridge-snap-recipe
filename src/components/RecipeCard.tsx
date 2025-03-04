
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  matchingIngredients: number;
  totalIngredients: number;
}

const RecipeCard = ({ id, title, image, cookTime, matchingIngredients, totalIngredients }: RecipeCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const matchPercentage = Math.round((matchingIngredients / totalIngredients) * 100);
  
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/recipe/${id}`)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-fridge-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 1.05
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Match percentage overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm border border-gray-100">
          <span className="text-fridge-700">{matchPercentage}% match</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{cookTime}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <Utensils className="h-4 w-4 mr-1" />
            <span>
              {matchingIngredients}/{totalIngredients} ingredients
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {matchingIngredients === totalIngredients
              ? "You have all ingredients!"
              : `Missing ${totalIngredients - matchingIngredients} ingredients`}
          </span>
          <ChevronRight className="h-4 w-4 text-fridge-600" />
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
