
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight, Heart, Star, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    if (matchPercentage === 100) return "from-blue-500 to-blue-600";
    if (matchPercentage >= 75) return "from-blue-400 to-blue-500";
    if (matchPercentage >= 50) return "from-amber-500 to-amber-600";
    return "from-gray-500 to-gray-600";
  };

  // Badge for match percentage
  const getMatchBadge = () => {
    if (matchPercentage === 100) return "bg-blue-500 hover:bg-blue-600";
    if (matchPercentage >= 75) return "bg-blue-400 hover:bg-blue-500";
    if (matchPercentage >= 50) return "bg-amber-500 hover:bg-amber-600";
    return "bg-gray-500 hover:bg-gray-600";
  };
  
  // For list view - simplified for better readability
  if (listView) {
    return (
      <motion.div
        className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex cursor-pointer"
        whileHover={{ y: -2, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.05)" }}
        onClick={() => navigate(`/recipe/${id}`)}
      >
        <div className="w-24 h-24 md:w-28 md:h-28 relative flex-shrink-0 bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Match badge - simplified */}
          <div className={cn(
            "absolute top-0 left-0 px-1.5 py-0.5 text-xs font-medium text-white",
            getMatchBadge()
          )}>
            {matchPercentage}%
          </div>
          
          {/* Favorite icon - simplified */}
          {favorite && (
            <div className="absolute bottom-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{title}</h3>
            
            {/* Rating stars - Only show if rating exists */}
            {rating > 0 && (
              <div className="flex items-center mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Matching ingredients info */}
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-gray-600">Ingredients</span>
              <span className="font-medium">{matchingIngredients}/{totalIngredients}</span>
            </div>
            <Progress 
              value={matchPercentage} 
              className="h-1.5 bg-gray-200" 
              indicatorClassName={`bg-gradient-to-r ${getMatchColor()}`} 
            />
          </div>
          
          {/* Cook time and action indicator */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              <Clock className="h-3 w-3 mr-1 text-blue-600" />
              <span>{cookTime} min</span>
            </div>
            
            <ChevronRight className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Grid view card - simplified for better aesthetics
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
      whileHover={{ 
        y: -3, 
        boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onClick={() => navigate(`/recipe/${id}`)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Match percentage overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-3">
          <div className="flex justify-between items-center">
            <Badge className={cn("text-white", getMatchBadge())}>
              {matchPercentage}% match
            </Badge>
            
            {/* Simple ingredient indicators */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(totalIngredients, 5) }, (_, i) => (
                <div key={i} className="ml-0.5">
                  {i < matchingIngredients ? (
                    <CircleCheck className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-white/70"></div>
                  )}
                </div>
              ))}
              {totalIngredients > 5 && (
                <span className="text-xs text-white/90 ml-1">+{totalIngredients - 5}</span>
              )}
            </div>
          </div>
          
          <Progress 
            value={matchPercentage} 
            className="h-1.5 mt-2 bg-white/30" 
            indicatorClassName={`bg-gradient-to-r ${getMatchColor()}`} 
          />
        </div>
        
        {/* Favorite icon */}
        {favorite && (
          <div className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{title}</h3>
        
        {/* Rating stars */}
        {rating > 0 && (
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i}
                className={`h-3.5 w-3.5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
        )}
        
        {/* Info badges */}
        <div className="flex items-center justify-between mt-1 text-sm gap-2">
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <Clock className="h-3.5 w-3.5 mr-1 text-blue-600" />
            <span>{cookTime} min</span>
          </div>
          
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <Utensils className="h-3.5 w-3.5 mr-1 text-blue-600" />
            <span>
              {matchingIngredients}/{totalIngredients}
            </span>
          </div>
        </div>
        
        <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center mt-3">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            matchingIngredients === totalIngredients 
              ? "bg-blue-50 text-blue-600" 
              : "bg-gray-50 text-gray-600"
          )}>
            {matchingIngredients === totalIngredients
              ? "Have all ingredients"
              : `Missing ${totalIngredients - matchingIngredients}`}
          </span>
          <div className="bg-blue-50 rounded-full p-1">
            <ChevronRight className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
