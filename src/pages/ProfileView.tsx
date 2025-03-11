
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  ArrowLeft, 
  Heart, 
  Settings, 
  Camera,
  Star,
  Pencil,
  ShoppingBag,
  Mail,
  MessageSquare,
  Clock,
  GraduationCap,
  Award,
  ChefHat,
  MapPin,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { findRecipeById } from "@/lib/recipeData";
import RecipeCard from "@/components/RecipeCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

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
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">My Profile</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(!isEditing)}
            className="hover:bg-gray-100 rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto px-4 space-y-6 pt-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.section 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Profile Header Background */}
            <div className="h-36 bg-gradient-to-r from-fridge-600 to-fridge-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606787619248-f301830a5a57?q=80&w=2070')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Profile Content */}
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="relative -mt-16 mb-5 flex justify-center md:justify-start">
                <div className="group">
                  <div className={`w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-white shadow-lg ${profilePicture ? 'p-0' : 'p-5'}`}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-full w-full text-fridge-500 opacity-80" />
                    )}
                  </div>
                  
                  {!isEditing && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute bottom-0 right-0 bg-fridge-500 text-white rounded-full h-10 w-10 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        <label className="cursor-pointer w-full h-full flex items-center justify-center bg-black/40 rounded-full">
                          <Camera className="h-8 w-8 text-white" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                          />
                        </label>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="text-center md:text-left">
                {isEditing ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 max-w-md mx-auto md:mx-0"
                  >
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus-visible:ring-fridge-500"
                      placeholder="Your name"
                    />
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus-visible:ring-fridge-500 pl-10"
                        placeholder="Your email (optional)"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile} 
                      variant="fridge"
                      className="w-full md:w-auto mt-2"
                    >
                      Save Profile
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-1 text-gray-800">{user?.name}</h2>
                    {user?.email && (
                      <p className="text-gray-500 mb-3 flex items-center justify-center md:justify-start">
                        <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                        {user.email}
                      </p>
                    )}
                    
                    {/* User Badges Section */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <Badge 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 px-3 py-1"
                      >
                        <ChefHat className="h-3 w-3 mr-1.5" />
                        Food Enthusiast
                      </Badge>
                      
                      {favoriteRecipes && favoriteRecipes.length > 5 && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 px-3 py-1">
                          <BookOpen className="h-3 w-3 mr-1.5" />
                          Recipe Collector
                        </Badge>
                      )}
                      
                      {totalReviews > 3 && (
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">
                          <Star className="h-3 w-3 mr-1.5" />
                          Top Reviewer
                        </Badge>
                      )}
                    </div>
                    
                    {/* User Stats */}
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center bg-white rounded-xl p-3 shadow-md border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                      >
                        <div className="bg-fridge-50 p-2.5 rounded-full mb-2">
                          <Heart className="h-5 w-5 text-fridge-500" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{user?.favoriteRecipes.length || 0}</span>
                        <span className="text-xs text-gray-500">Favorites</span>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center bg-white rounded-xl p-3 shadow-md border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                      >
                        <div className="bg-fridge-50 p-2.5 rounded-full mb-2">
                          <MessageSquare className="h-5 w-5 text-fridge-500" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{totalReviews}</span>
                        <span className="text-xs text-gray-500">Reviews</span>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center bg-white rounded-xl p-3 shadow-md border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                      >
                        <div className="bg-fridge-50 p-2.5 rounded-full mb-2">
                          <Star className="h-5 w-5 text-fridge-500" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
                        <span className="text-xs text-gray-500">Avg. Rating</span>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.section>
          
          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full py-6 flex items-center justify-center gap-3 text-gray-700 shadow-md bg-white hover:bg-gray-50 border border-gray-200 rounded-xl group"
                  onClick={() => navigate("/shopping-list")}
                >
                  <div className="h-12 w-12 rounded-full bg-fridge-50 flex items-center justify-center group-hover:bg-fridge-100 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-fridge-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-base">Shopping List</span>
                    <span className="text-sm text-gray-500">{user?.shoppingList.length || 0} items</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full py-6 flex items-center justify-center gap-3 text-gray-700 shadow-md bg-white hover:bg-gray-50 border border-gray-200 rounded-xl group"
                  onClick={() => navigate("/inventory")}
                >
                  <div className="h-12 w-12 rounded-full bg-fridge-50 flex items-center justify-center group-hover:bg-fridge-100 transition-colors">
                    <GraduationCap className="h-6 w-6 text-fridge-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-base">My Inventory</span>
                    <span className="text-sm text-gray-500">Manage items</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.section>
          
          {/* Favorite Recipes */}
          <motion.section 
            variants={itemVariants} 
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center text-gray-800">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Favorite Recipes
              </h2>
              <Button 
                variant="outline" 
                onClick={() => navigate("/recipes")}
                className="text-sm rounded-full"
                size="sm"
              >
                Browse All
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            {favoriteRecipes && favoriteRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <motion.div 
                className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-3 shadow-sm"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2 
                  }}
                >
                  <Heart className="h-7 w-7 text-gray-300" />
                </motion.div>
                <h3 className="text-lg font-medium mb-1 text-gray-800">No favorite recipes yet</h3>
                <p className="text-gray-500 mb-4 max-w-xs mx-auto">Start exploring and save recipes you love to your collection</p>
                <Button onClick={() => navigate("/recipes")} variant="fridge" className="rounded-full px-6">
                  Browse Recipes
                </Button>
              </motion.div>
            )}
          </motion.section>
          
          {/* Recent Reviews */}
          {totalReviews > 0 && (
            <motion.section 
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Reviews
                </h2>
                <Badge variant="secondary" className="rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                {Object.entries(user?.reviews || {}).slice(0, 2).map(([recipeId, reviews]) => {
                  const recipe = findRecipeById(recipeId);
                  if (!recipe || reviews.length === 0) return null;
                  
                  const latestReview = reviews[reviews.length - 1];
                  
                  return (
                    <motion.div
                      key={recipeId}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="hover:shadow-md transition-all cursor-pointer border-gray-100"
                        onClick={() => navigate(`/recipe/${recipeId}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{recipe.title}</p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < latestReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} 
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(latestReview.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs bg-fridge-50 hover:bg-fridge-100 border-fridge-200 text-fridge-700 rounded-full">
                              <Award className="h-3 w-3 mr-1" />
                              Your Review
                            </Badge>
                          </div>
                          {latestReview.comment && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{latestReview.comment}</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full text-fridge-600 hover:bg-fridge-50 mt-4 rounded-lg" 
                onClick={() => navigate("/recipes")}
              >
                See All Reviews
              </Button>
            </motion.section>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default ProfileView;
