
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight, Heart, Star, Circle, CircleCheck, BookOpen } from "lucide-react";
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
  listView?: boolean;
}

const RecipeCard = ({ 
  id, 
  title, 
  image, 
  cookTime, 
  matchingIngredients, 
  totalIngredients,
  listView = false
}: RecipeCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, getRecipeRating } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const matchPercentage = Math.round((matchingIngredients / totalIngredients) * 100);
  const favorite = isFavorite(id);
  
  // Add a safety check to prevent accessing properties of undefined
  let rating = 0;
  try {
    rating = getRecipeRating ? getRecipeRating(id) || 0 : 0;
  } catch (error) {
    console.error("Error getting recipe rating:", error);
    rating = 0;
  }
  
  // Color for match percentage
  const getMatchColor = () => {
    if (matchPercentage === 100) return "from-green-400 to-green-500";
    if (matchPercentage >= 75) return "from-blue-400 to-blue-500";
    if (matchPercentage >= 50) return "from-amber-400 to-amber-500";
    return "from-gray-400 to-gray-500";
  };
  
  // For list view
  if (listView) {
    return (
      <motion.div
        className="rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-all duration-300 border border-gray-100 flex"
        whileHover={{ y: -2, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
        onClick={() => navigate(`/recipe/${id}`)}
      >
        <div className="w-24 h-24 md:w-32 md:h-32 relative overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-fridge-500 border-t-transparent rounded-full animate-spin"></div>
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
          
          {/* Favorite icon */}
          {favorite && (
            <div className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              <Heart className="h-3 w-3 text-red-500 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{title}</h3>
            
            {/* Rating stars - Only show if rating exists and is greater than 0 */}
            {rating > 0 && (
              <div className="flex items-center mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-between gap-2 mt-2">
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>{cookTime}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <Utensils className="h-3 w-3 mr-1" />
              <span>{matchingIngredients}/{totalIngredients}</span>
            </div>
            
            {/* Match percentage badge */}
            <div className={`text-xs font-medium text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${getMatchColor()}`}>
              {matchPercentage}% match
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center px-2 text-fridge-600">
          <ChevronRight className="h-5 w-5" />
        </div>
      </motion.div>
    );
  }
  
  // Default grid view
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={() => navigate(`/recipe/${id}`)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-fridge-500 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex justify-between items-center">
            <div className="text-white text-xs font-semibold">
              {matchPercentage}% match
            </div>
            
            {/* Visualize matching ingredients */}
            <div className="flex items-center">
              {Array.from({ length: totalIngredients }, (_, i) => (
                <div key={i} className="ml-1">
                  {i < matchingIngredients ? (
                    <CircleCheck className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Circle className="h-3 w-3 text-white/60" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Progress 
            value={matchPercentage} 
            className="h-1.5 mt-1 bg-white/30 rounded-full" 
            indicatorClassName={`bg-gradient-to-r ${getMatchColor()}`} 
          />
        </div>
        
        {/* Favorite icon */}
        {favorite && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-gray-100">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        
        {/* Rating stars - Only show if rating exists and is greater than 0 */}
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
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{cookTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Utensils className="h-4 w-4 mr-1" />
            <span>
              {matchingIngredients}/{totalIngredients}
            </span>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center mt-4">
          <span className={`text-xs ${matchingIngredients === totalIngredients ? "text-green-600 font-medium" : "text-gray-500"}`}>
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
