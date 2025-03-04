
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ArrowLeft, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { findRecipeById } from "@/lib/recipeData";
import RecipeCard from "@/components/RecipeCard";
import { toast } from "sonner";

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const favoriteRecipes = user?.favoriteRecipes.map(id => {
    const recipe = findRecipeById(id);
    if (!recipe) return null;
    
    return {
      ...recipe,
      matchingIngredients: 0, // Default values since we're not matching here
      totalIngredients: recipe.ingredients.length
    };
  }).filter(Boolean);
  
  const handleSaveProfile = () => {
    updateUser({
      name: name.trim() || "Guest User",
      email: email.trim()
    });
    
    setIsEditing(false);
    toast.success("Profile updated successfully");
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
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-fridge-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-fridge-600" />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your email (optional)"
                  />
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-medium">{user?.name}</h2>
                  {user?.email && <p className="text-gray-500">{user.email}</p>}
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
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  cookTime={recipe.cookTime}
                  matchingIngredients={recipe.matchingIngredients}
                  totalIngredients={recipe.totalIngredients}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No favorite recipes yet</h3>
              <p className="text-gray-500 mb-4">Start exploring and save recipes you love</p>
              <Button onClick={() => navigate("/recipes")}>
                Browse Recipes
              </Button>
            </div>
          )}
        </section>
        
        <section className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full py-6 flex items-center justify-center text-gray-700 shadow-sm"
            onClick={() => navigate("/shopping-list")}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            My Shopping List
          </Button>
        </section>
      </main>
    </motion.div>
  );
};

export default ProfileView;

import { ShoppingBag } from "lucide-react";
