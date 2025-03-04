
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight, Heart, Star, Circle, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";

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
  const { isFavorite, getRecipeRating } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const matchPercentage = Math.round((matchingIngredients / totalIngredients) * 100);
  const favorite = isFavorite(id);
  const rating = getRecipeRating(id);
  
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex justify-between items-center">
            <div className="text-white text-xs font-medium">
              {matchPercentage}% match
            </div>
            
            {/* Visualize matching ingredients */}
            <div className="flex items-center">
              {Array.from({ length: totalIngredients }, (_, i) => (
                <div key={i} className="ml-1">
                  {i < matchingIngredients ? (
                    <CircleCheck className="h-3 w-3 text-green-400" />
                  ) : (
                    <Circle className="h-3 w-3 text-white/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Progress 
            value={matchPercentage} 
            className="h-1 mt-1 bg-white/30" 
            indicatorClassName="bg-green-400" 
          />
        </div>
        
        {/* Favorite icon */}
        {favorite && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-gray-100">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{title}</h3>
        
        {/* Rating stars */}
        {rating > 0 && (
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i}
                className={`h-3.5 w-3.5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
          </div>
        )}
        
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
