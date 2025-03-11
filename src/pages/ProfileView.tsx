
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  ArrowLeft, 
  Heart, 
  Camera,
  Star,
  Edit3,
  ShoppingBag,
  Mail,
  MessageSquare,
  ChefHat,
  BookOpen,
  Save,
  Check,
  X,
  Calendar,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { findRecipeById } from "@/lib/recipeData";
import RecipeCard from "@/components/RecipeCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "Food enthusiast exploring new flavors and recipes!");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  const favoriteRecipes = user?.favoriteRecipes.map(id => {
    const recipe = findRecipeById(id);
    if (!recipe) return null;
    
    return {
      ...recipe,
      matchingIngredients: 0,
      totalIngredients: recipe.ingredients.length
    };
  }).filter(Boolean);

  // Calculate user stats
  const totalReviews = Object.values(user?.reviews || {}).flat().length;
  const recipesCooked = totalReviews > 0 ? Math.floor(totalReviews * 1.5) : 0;
  const memberSince = "March 2025";
  const averageRating = totalReviews > 0 
    ? (Object.values(user?.reviews || {}).flat().reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  
  const handleSaveProfile = () => {
    updateUser({
      name: name.trim() || "Guest User",
      email: email.trim(),
      bio: bio.trim(),
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const getUserLevel = () => {
    if (totalReviews >= 10) return "Master Chef";
    if (totalReviews >= 5) return "Seasoned Cook";
    if (totalReviews >= 1) return "Home Cook";
    return "Cooking Enthusiast";
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">My Profile</h1>
          {isEditing ? (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="rounded-full text-red-500"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveProfile}
                className="rounded-full text-green-500"
              >
                <Check className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-full"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>
      
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden border border-gray-100"
          >
            {/* Profile Content */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-500 text-white rounded-full p-1.5 shadow-md">
                      <Camera className="h-4 w-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </label>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="Your email (optional)"
                        />
                      </div>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="A short bio about yourself..."
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                        {user?.email && (
                          <p className="text-gray-500 flex items-center justify-center sm:justify-start mt-1">
                            <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span>{user.email}</span>
                          </p>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mt-3">
                        {bio}
                      </p>
                      
                      <Badge 
                        className="mt-3 bg-amber-100 text-amber-800 hover:bg-amber-200 border-0"
                      >
                        {getUserLevel()}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {/* Stats Section */}
              {!isEditing && (
                <div className="mt-6 grid grid-cols-4 gap-3 border-t border-gray-100 pt-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">{user?.favoriteRecipes.length || 0}</span>
                    <span className="text-xs text-gray-500">Favorites</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">{totalReviews}</span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">{recipesCooked}</span>
                    <span className="text-xs text-gray-500">Cooked</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">{averageRating}</span>
                    <span className="text-xs text-gray-500">Avg. Rating</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 grid grid-cols-3 gap-3"
          >
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => navigate("/shopping-list")}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm">Shopping List</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => navigate("/inventory")}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Inventory</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => navigate("/recipes")}
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-sm">Browse Recipes</span>
            </Button>
          </motion.div>
          
          {/* Content Tabs */}
          <motion.div variants={itemVariants} className="mt-6">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 mb-4">
                <TabsTrigger value="favorites">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites" className="m-0">
                {favoriteRecipes && favoriteRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteRecipes.map((recipe: any) => (
                      <motion.div
                        key={recipe.id}
                        whileHover={{ y: -5 }}
                        className="transform transition-all duration-200"
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
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-800">No favorites yet</h3>
                    <p className="text-gray-500 mt-1 mb-4">Start exploring recipes to add to your favorites</p>
                    <Button onClick={() => navigate("/recipes")} variant="outline">
                      Browse Recipes
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="m-0">
                {totalReviews > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(user?.reviews || {}).map(([recipeId, reviews]) => {
                      const recipe = findRecipeById(recipeId);
                      if (!recipe || reviews.length === 0) return null;
                      
                      const latestReview = reviews[reviews.length - 1];
                      
                      return (
                        <Card
                          key={recipeId}
                          className="hover:shadow-sm transition-all cursor-pointer overflow-hidden"
                          onClick={() => navigate(`/recipe/${recipeId}`)}
                        >
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="w-20 h-20 bg-gray-100">
                                <img 
                                  src={recipe.image} 
                                  alt={recipe.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3 flex-1">
                                <p className="font-medium text-gray-800">{recipe.title}</p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3.5 w-3.5 ${i < latestReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} 
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(latestReview.date).toLocaleDateString()}
                                  </span>
                                </div>
                                {latestReview.comment && (
                                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{latestReview.comment}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-800">No reviews yet</h3>
                    <p className="text-gray-500 mt-1 mb-4">Try some recipes and share your thoughts</p>
                    <Button onClick={() => navigate("/recipes")} variant="outline">
                      Explore Recipes
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileView;
