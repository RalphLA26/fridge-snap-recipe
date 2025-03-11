
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, ChevronRight, Heart, Star, CircleCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
  
  // For list view
  if (listView) {
    return (
      <Card
        className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex h-24"
        onClick={() => navigate(`/recipe/${id}`)}
      >
        <motion.div
          className="w-24 h-full relative flex-shrink-0 bg-gray-100"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
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
          
          {/* Match percentage indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200">
            <div 
              className={`h-full bg-gradient-to-r ${getMatchColor()}`} 
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
          
          {/* Favorite icon */}
          {favorite && (
            <div className="absolute bottom-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            </div>
          )}
        </motion.div>
        
        <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="font-medium text-gray-900 mb-0.5 line-clamp-1">{title}</h3>
            
            {/* Rating stars - Only show if rating exists */}
            {rating > 0 && (
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Bottom info section */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">
                <Clock className="h-3 w-3 mr-1 text-blue-600" />
                <span>{cookTime} min</span>
              </div>
              
              <Badge className={cn("text-xs", getMatchBadge())}>
                {matchPercentage}%
              </Badge>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">
                {matchingIngredients}/{totalIngredients}
              </span>
              <ChevronRight className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Grid view card
  return (
    <Card className="overflow-hidden h-full flex flex-col cursor-pointer group">
      <motion.div
        className="relative overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
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
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } group-hover:scale-110 transition-transform duration-700`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Match percentage badge */}
          <Badge 
            className={cn(
              "absolute top-2 left-2 shadow-md",
              getMatchBadge()
            )}
          >
            {matchPercentage}% match
          </Badge>
          
          {/* Cook time badge */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-md">
            <Clock className="h-3 w-3 mr-1 text-blue-600" />
            <span className="text-xs font-medium">{cookTime} min</span>
          </div>
          
          {/* Favorite icon */}
          {favorite && (
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </div>
          )}
        </div>
        
        {/* Title and info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-medium text-lg mb-1 line-clamp-1 drop-shadow-sm">{title}</h3>
          
          {/* Ingredients progress */}
          <div className="flex justify-between items-center mb-1 text-xs text-white/90">
            <span>Ingredients</span>
            <span className="font-medium">{matchingIngredients}/{totalIngredients}</span>
          </div>
          <Progress 
            value={matchPercentage} 
            className="h-1.5 bg-white/30" 
            indicatorClassName={`bg-gradient-to-r ${getMatchColor()}`} 
          />
        </div>
      </motion.div>
      
      {/* Card footer */}
      <div className="p-3 mt-auto border-t border-gray-100 flex items-center justify-between" onClick={() => navigate(`/recipe/${id}`)}>
        {/* Rating stars - only show if rating exists */}
        {rating > 0 ? (
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i}
                className={`h-3.5 w-3.5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 flex items-center">
            <Utensils className="h-3.5 w-3.5 mr-1 text-blue-600" />
            <span>{totalIngredients} ingredients</span>
          </div>
        )}
        
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 group-hover:bg-blue-50 transition-colors duration-300"
        >
          <span className="text-blue-600">View</span>
          <ArrowRight className="h-3 w-3 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
        </Badge>
      </div>
    </Card>
  );
};

export default RecipeCard;
