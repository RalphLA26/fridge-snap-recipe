
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
  BookOpen,
  Edit3,
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
import { Separator } from "@/components/ui/separator";
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
  const [activeTab, setActiveTab] = useState("favorites");
  
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
          {isEditing ? (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="hover:bg-red-50 hover:text-red-600 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveProfile}
                className="hover:bg-green-50 hover:text-green-600 rounded-full"
              >
                <Check className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(!isEditing)}
              className="hover:bg-fridge-50 hover:text-fridge-600 rounded-full"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          )}
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
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-fridge-600 to-fridge-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606787619248-f301830a5a57?q=80&w=2070')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Profile Content */}
            <div className="px-6 pt-2 pb-6 relative">
              <div className="flex flex-col md:flex-row gap-5 md:items-end">
                {/* Avatar */}
                <div className="relative -mt-14 flex justify-center md:justify-start">
                  <div className="group">
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-white shadow-lg ${profilePicture ? 'p-0' : 'p-5'}`}>
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-full w-full text-fridge-500 opacity-80" />
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full"
                        >
                          <label className="cursor-pointer w-full h-full flex items-center justify-center bg-black/40 rounded-full">
                            <Camera className="h-6 w-6 text-white" />
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
                    
                    {!isEditing && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute bottom-0 right-0 bg-fridge-500 text-white rounded-full h-8 w-8 shadow-md hover:bg-fridge-600 transition-all duration-200"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
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
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fridge-500 focus:border-transparent"
                        placeholder="A short bio about yourself..."
                        rows={2}
                      />
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                          {user?.email && (
                            <p className="text-gray-500 flex items-center justify-center md:justify-start">
                              <Mail className="h-4 w-4 mr-1.5 text-gray-400 shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-end">
                          <Badge 
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 px-3 py-1.5"
                          >
                            <Award className="h-3.5 w-3.5 mr-1.5" />
                            {getUserLevel()}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-2 text-sm md:text-base">
                        {bio}
                      </p>
                      
                      {/* User Badges Section */}
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                        <Badge 
                          variant="outline"
                          className="bg-fridge-50 text-fridge-700 border-fridge-200 hover:bg-fridge-100"
                        >
                          <ChefHat className="h-3 w-3 mr-1.5" />
                          Food Enthusiast
                        </Badge>
                        
                        {totalReviews > 0 && (
                          <Badge 
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                          >
                            <Star className="h-3 w-3 mr-1.5" />
                            Reviewer
                          </Badge>
                        )}
                        
                        {favoriteRecipes && favoriteRecipes.length > 5 && (
                          <Badge 
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          >
                            <BookOpen className="h-3 w-3 mr-1.5" />
                            Recipe Collector
                          </Badge>
                        )}
                        
                        <Badge 
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          <Calendar className="h-3 w-3 mr-1.5" />
                          Member since {memberSince}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Stats Cards */}
              {!isEditing && (
                <div className="mt-6 grid grid-cols-4 gap-3">
                  <motion.div 
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                  >
                    <div className="bg-fridge-50 p-2 rounded-full mb-1.5">
                      <Heart className="h-4 w-4 text-fridge-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{user?.favoriteRecipes.length || 0}</span>
                    <span className="text-xs text-gray-500">Favorites</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                  >
                    <div className="bg-fridge-50 p-2 rounded-full mb-1.5">
                      <MessageSquare className="h-4 w-4 text-fridge-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{totalReviews}</span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                  >
                    <div className="bg-fridge-50 p-2 rounded-full mb-1.5">
                      <ChefHat className="h-4 w-4 text-fridge-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{recipesCooked}</span>
                    <span className="text-xs text-gray-500">Cooked</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-fridge-200 transition-all duration-200"
                  >
                    <div className="bg-fridge-50 p-2 rounded-full mb-1.5">
                      <Star className="h-4 w-4 text-fridge-500" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{averageRating}</span>
                    <span className="text-xs text-gray-500">Avg. Rating</span>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.section>
          
          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.98 }}
                className="col-span-3 md:col-span-1"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-24 md:h-auto md:py-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 text-gray-700 shadow-sm bg-white hover:bg-fridge-50 hover:text-fridge-700 hover:border-fridge-200 border border-gray-200 rounded-xl group"
                  onClick={() => navigate("/shopping-list")}
                >
                  <div className="h-10 w-10 rounded-full bg-fridge-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <ShoppingBag className="h-5 w-5 text-fridge-600" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="font-semibold text-sm md:text-base">Shopping List</span>
                    <span className="text-xs text-gray-500">{user?.shoppingList.length || 0} items</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.98 }}
                className="col-span-3 md:col-span-1"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-24 md:h-auto md:py-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 text-gray-700 shadow-sm bg-white hover:bg-fridge-50 hover:text-fridge-700 hover:border-fridge-200 border border-gray-200 rounded-xl group"
                  onClick={() => navigate("/inventory")}
                >
                  <div className="h-10 w-10 rounded-full bg-fridge-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <GraduationCap className="h-5 w-5 text-fridge-600" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="font-semibold text-sm md:text-base">My Inventory</span>
                    <span className="text-xs text-gray-500">Manage items</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.98 }}
                className="col-span-3 md:col-span-1"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-24 md:h-auto md:py-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 text-gray-700 shadow-sm bg-white hover:bg-fridge-50 hover:text-fridge-700 hover:border-fridge-200 border border-gray-200 rounded-xl group"
                  onClick={() => navigate("/recipes")}
                >
                  <div className="h-10 w-10 rounded-full bg-fridge-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <LayoutGrid className="h-5 w-5 text-fridge-600" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="font-semibold text-sm md:text-base">All Recipes</span>
                    <span className="text-xs text-gray-500">Browse collection</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.section>
          
          {/* Content Tabs */}
          <motion.section variants={itemVariants}>
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-fridge-50 rounded-xl p-1 mb-4">
                <TabsTrigger 
                  value="favorites" 
                  className="rounded-lg data-[state=active]:bg-white"
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-lg data-[state=active]:bg-white"
                  onClick={() => setActiveTab("reviews")}
                >
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites" className="m-0">
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
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="bg-fridge-50 p-4 rounded-full inline-flex items-center justify-center mb-4"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 2 
                      }}
                    >
                      <Heart className="h-7 w-7 text-fridge-400" />
                    </motion.div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800">No favorites yet</h3>
                    <p className="text-gray-500 mb-5 max-w-sm mx-auto">Start exploring and save recipes you love to your collection</p>
                    <Button onClick={() => navigate("/recipes")} variant="fridge" className="rounded-full px-6">
                      Browse Recipes
                    </Button>
                  </motion.div>
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
                        <motion.div
                          key={recipeId}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className="hover:shadow-md transition-all cursor-pointer border-gray-100 overflow-hidden"
                            onClick={() => navigate(`/recipe/${recipeId}`)}
                          >
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-24 h-20 md:h-auto bg-gray-100">
                                  <img 
                                    src={recipe.image} 
                                    alt={recipe.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4 flex-1">
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
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="bg-fridge-50 p-4 rounded-full inline-flex items-center justify-center mb-4"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 2 
                      }}
                    >
                      <MessageSquare className="h-7 w-7 text-fridge-400" />
                    </motion.div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800">No reviews yet</h3>
                    <p className="text-gray-500 mb-5 max-w-sm mx-auto">Try some recipes and share your thoughts with the community</p>
                    <Button onClick={() => navigate("/recipes")} variant="fridge" className="rounded-full px-6">
                      Explore Recipes
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.section>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default ProfileView;
