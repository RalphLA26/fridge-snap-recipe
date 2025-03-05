
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  ArrowLeft, 
  Heart, 
  Settings, 
  Upload, 
  ShoppingBag, 
  Camera,
  Star,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { findRecipeById } from "@/lib/recipeData";
import RecipeCard from "@/components/RecipeCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  const favoriteRecipes = user?.favoriteRecipes.map(id => {
    const recipe = findRecipeById(id);
    if (!recipe) return null;
    
    return {
      ...recipe,
      matchingIngredients: 0, // Default values since we're not matching here
      totalIngredients: recipe.ingredients.length
    };
  }).filter(Boolean);

  // Calculate user activity stats
  const totalReviews = Object.values(user?.reviews || {}).flat().length;
  const averageRating = totalReviews > 0 
    ? (Object.values(user?.reviews || {}).flat().reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  
  const handleSaveProfile = () => {
    updateUser({
      name: name.trim() || "Guest User",
      email: email.trim()
    });
    
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result as string);
          toast.success("Profile picture updated");
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">My Profile</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4 space-y-6">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full overflow-hidden bg-fridge-100 flex items-center justify-center border-2 border-fridge-200 ${profilePicture ? 'p-0' : 'p-4'}`}>
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-fridge-600" />
                )}
              </div>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-0 right-0 bg-fridge-500 text-white rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label className="cursor-pointer w-full h-full flex items-center justify-center bg-black/30 rounded-full">
                    <Camera className="h-8 w-8 text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-fridge-500"
                    placeholder="Your name"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-fridge-500"
                    placeholder="Your email (optional)"
                  />
                  <Button onClick={handleSaveProfile} variant="fridge">Save Profile</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-1">{user?.name}</h2>
                  {user?.email && <p className="text-gray-500 mb-3">{user.email}</p>}
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-lg font-semibold text-fridge-600">{user?.favoriteRecipes.length || 0}</span>
                      <span className="text-xs text-gray-500">Favorites</span>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-lg font-semibold text-fridge-600">{totalReviews}</span>
                      <span className="text-xs text-gray-500">Reviews</span>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-lg font-semibold text-fridge-600 flex items-center">
                        {averageRating} <Star className="h-3 w-3 ml-1 text-yellow-500" />
                      </span>
                      <span className="text-xs text-gray-500">Avg. Rating</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Favorite Recipes
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/recipes")}
            >
              Browse All
            </Button>
          </div>
          
          {favoriteRecipes && favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteRecipes.map((recipe: any) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    cookTime={recipe.cookTime}
                    matchingIngredients={recipe.matchingIngredients}
                    totalIngredients={recipe.totalIngredients}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-10 bg-white rounded-lg shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No favorite recipes yet</h3>
              <p className="text-gray-500 mb-4">Start exploring and save recipes you love</p>
              <Button onClick={() => navigate("/recipes")} variant="fridge">
                Browse Recipes
              </Button>
            </motion.div>
          )}
        </section>
        
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="py-6 flex items-center justify-center text-gray-700 shadow bg-white hover:bg-gray-50"
              onClick={() => navigate("/shopping-list")}
            >
              <ShoppingBag className="h-5 w-5 mr-2 text-fridge-600" />
              <div className="flex flex-col items-start">
                <span>Shopping List</span>
                <span className="text-xs text-gray-500">{user?.shoppingList.length || 0} items</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex items-center justify-center text-gray-700 shadow bg-white hover:bg-gray-50"
              onClick={() => navigate("/inventory")}
            >
              <User className="h-5 w-5 mr-2 text-fridge-600" />
              <div className="flex flex-col items-start">
                <span>My Inventory</span>
                <span className="text-xs text-gray-500">Check your items</span>
              </div>
            </Button>
          </div>
        </section>
        
        {totalReviews > 0 && (
          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-medium flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Reviews
            </h2>
            
            <div className="space-y-4">
              {Object.entries(user?.reviews || {}).slice(0, 2).map(([recipeId, reviews]) => {
                const recipe = findRecipeById(recipeId);
                if (!recipe || reviews.length === 0) return null;
                
                const latestReview = reviews[reviews.length - 1];
                
                return (
                  <div key={recipeId} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < latestReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(latestReview.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Your Review
                      </Badge>
                    </div>
                    {latestReview.comment && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{latestReview.comment}</p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full text-fridge-600" 
              onClick={() => navigate("/recipes")}
            >
              Browse All Recipes
            </Button>
          </section>
        )}
      </main>
    </motion.div>
  );
};

export default ProfileView;
