
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight, Heart, Star, Circle, CircleCheck, BookOpen } from "lucide-react";
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
    if (matchPercentage === 100) return "from-green-500 to-green-600";
    if (matchPercentage >= 75) return "from-recipe-500 to-recipe-600";
    if (matchPercentage >= 50) return "from-amber-500 to-amber-600";
    return "from-gray-500 to-gray-600";
  };

  // Badge for match percentage
  const getMatchBadge = () => {
    if (matchPercentage === 100) return "bg-green-500 hover:bg-green-600";
    if (matchPercentage >= 75) return "bg-recipe-500 hover:bg-recipe-600";
    if (matchPercentage >= 50) return "bg-amber-500 hover:bg-amber-600";
    return "bg-gray-500 hover:bg-gray-600";
  };
  
  // For list view - completely redesigned for better visual hierarchy
  if (listView) {
    return (
      <motion.div
        className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex cursor-pointer"
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
        onClick={() => navigate(`/recipe/${id}`)}
      >
        <div className="w-24 h-24 md:w-32 md:h-32 relative overflow-hidden bg-gray-100 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-recipe-500 border-t-transparent rounded-full animate-spin"></div>
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
          
          {/* Match percentage ribbon */}
          <div className={cn(
            "absolute top-0 left-0 px-2 py-1 text-xs font-medium text-white shadow-sm",
            getMatchBadge()
          )}>
            {matchPercentage}%
          </div>
          
          {/* Favorite icon */}
          {favorite && (
            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{title}</h3>
            
            {/* Rating stars - Only show if rating exists and is greater than 0 */}
            {rating > 0 && (
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1.5">{rating}/5</span>
              </div>
            )}
          </div>
          
          {/* Matching ingredients progress */}
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
          
          {/* Cook time badge */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <Clock className="h-3 w-3 mr-1 text-recipe-600" />
              <span>{cookTime} min</span>
            </div>
            
            <motion.div 
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-recipe-600"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default grid view with improved visual hierarchy
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      whileHover={{ 
        y: -4, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onClick={() => navigate(`/recipe/${id}`)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-recipe-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 1.05
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Match percentage overlay with improved gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
          <div className="flex justify-between items-center">
            <Badge className={cn("text-white border-none", getMatchBadge())}>
              {matchPercentage}% match
            </Badge>
            
            {/* Visualize matching ingredients */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(totalIngredients, 5) }, (_, i) => (
                <div key={i} className="ml-0.5">
                  {i < Math.min(matchingIngredients, 5) ? (
                    <CircleCheck className="h-4 w-4 text-green-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-white/70" />
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
            className="h-2 mt-2 bg-white/30 rounded-full" 
            indicatorClassName={`bg-gradient-to-r ${getMatchColor()} rounded-full`} 
          />
        </div>
        
        {/* Favorite icon - improved visualization */}
        {favorite && (
          <motion.div 
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-gray-100"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}
          >
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </motion.div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-recipe-700 transition-colors">{title}</h3>
        
        {/* Rating stars - Only show if rating exists and is greater than 0 */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1.5">{rating}/5</span>
          </div>
        )}
        
        {/* Info badges with improved spacing and visual hierarchy */}
        <div className="flex items-center justify-between mt-2 text-sm gap-2">
          <div className="flex items-center text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Clock className="h-4 w-4 mr-1.5 text-recipe-600" />
            <span>{cookTime} min</span>
          </div>
          
          <div className="flex items-center text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Utensils className="h-4 w-4 mr-1.5 text-recipe-600" />
            <span>
              {matchingIngredients}/{totalIngredients}
            </span>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center mt-4">
          <span className={cn(
            "text-xs font-medium px-2.5 py-1.5 rounded-full",
            matchingIngredients === totalIngredients 
              ? "bg-green-50 text-green-600 border border-green-100" 
              : "bg-gray-50 text-gray-600 border border-gray-100"
          )}>
            {matchingIngredients === totalIngredients
              ? "Have all ingredients!"
              : `Missing ${totalIngredients - matchingIngredients}`}
          </span>
          <motion.div 
            className="bg-recipe-50 rounded-full p-1.5 group-hover:bg-recipe-100 transition-colors"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ChevronRight className="h-4 w-4 text-recipe-600" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
