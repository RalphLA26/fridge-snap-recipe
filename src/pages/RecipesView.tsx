
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Search, Filter, Clock, Filter as FilterIcon, Grid, List, BookOpen, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/RecipeCard";
import { findRecipesByIngredients } from "@/lib/recipeData";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RecipesView = () => {
  const navigate = useNavigate();
  const { user, isFavorite } = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cookTimeFilter, setCookTimeFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"matching" | "cookTime" | "alphabetical">("matching");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Load saved ingredients from localStorage on initial render
  useEffect(() => {
    try {
      const savedIngredients = localStorage.getItem("fridgeIngredients");
      if (savedIngredients) {
        const parsedIngredients = JSON.parse(savedIngredients);
        setIngredients(parsedIngredients);
        
        // Find recipes based on ingredients
        const matchedRecipes = findRecipesByIngredients(parsedIngredients);
        setRecipes(matchedRecipes);
        setFilteredRecipes(matchedRecipes);
      } else {
        // No ingredients found, show all recipes
        const allRecipes = findRecipesByIngredients([]);
        setRecipes(allRecipes);
        setFilteredRecipes(allRecipes);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
      // Fall back to showing all recipes
      const allRecipes = findRecipesByIngredients([]);
      setRecipes(allRecipes);
      setFilteredRecipes(allRecipes);
      toast.error("Error loading recipes");
    }
  }, []);
  
  // Filter and sort recipes
  useEffect(() => {
    let result = [...recipes];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(({ recipe }) => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by cook time
    if (cookTimeFilter.length > 0) {
      result = result.filter(({ recipe }) => {
        const timeInMinutes = parseInt(recipe.cookTime);
        if (cookTimeFilter.includes("quick") && timeInMinutes <= 20) return true;
        if (cookTimeFilter.includes("medium") && timeInMinutes > 20 && timeInMinutes <= 40) return true;
        if (cookTimeFilter.includes("long") && timeInMinutes > 40) return true;
        return false;
      });
    }
    
    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter(({ recipe }) => isFavorite(recipe.id));
    }
    
    // Sort recipes
    result.sort((a, b) => {
      if (sortOrder === "matching") {
        return b.matchingCount - a.matchingCount;
      } else if (sortOrder === "cookTime") {
        return parseInt(a.recipe.cookTime) - parseInt(b.recipe.cookTime);
      } else if (sortOrder === "alphabetical") {
        return a.recipe.title.localeCompare(b.recipe.title);
      }
      return 0;
    });
    
    setFilteredRecipes(result);
  }, [recipes, searchQuery, cookTimeFilter, sortOrder, showFavoritesOnly, isFavorite]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const handleCookTimeFilterChange = (value: string) => {
    setCookTimeFilter(prev => {
      if (prev.includes(value)) {
        return prev.filter(time => time !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setCookTimeFilter([]);
    setShowFavoritesOnly(false);
    setSortOrder("matching");
    toast.info("Filters cleared");
  };

  // Group recipes by matching percentage
  const getRecipeGroups = () => {
    if (filteredRecipes.length === 0) return {};
    
    const groups: {[key: string]: any[]} = {
      "perfect": [],
      "good": [],
      "some": [],
      "few": []
    };
    
    filteredRecipes.forEach(item => {
      const matchPercentage = (item.matchingCount / item.recipe.ingredients.length) * 100;
      
      if (matchPercentage === 100) {
        groups.perfect.push(item);
      } else if (matchPercentage >= 75) {
        groups.good.push(item);
      } else if (matchPercentage >= 50) {
        groups.some.push(item);
      } else {
        groups.few.push(item);
      }
    });
    
    return groups;
  };

  const recipeGroups = getRecipeGroups();
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Recipes</h1>
          <div className="flex space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
              {ingredients.length} ingredients
            </span>
          </div>
        </div>
      </header>
      
      <div className="container max-w-5xl mx-auto p-4">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 bg-white"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center ${cookTimeFilter.length > 0 || showFavoritesOnly ? 'bg-gray-100' : ''}`}
                  >
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filter
                    {(cookTimeFilter.length > 0 || showFavoritesOnly) && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                        {cookTimeFilter.length + (showFavoritesOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filters</h3>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Cook Time</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quick" 
                            checked={cookTimeFilter.includes("quick")}
                            onCheckedChange={() => handleCookTimeFilterChange("quick")}
                          />
                          <label htmlFor="quick" className="text-sm">Quick (under 20 mins)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="medium" 
                            checked={cookTimeFilter.includes("medium")}
                            onCheckedChange={() => handleCookTimeFilterChange("medium")}
                          />
                          <label htmlFor="medium" className="text-sm">Medium (20-40 mins)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="long" 
                            checked={cookTimeFilter.includes("long")}
                            onCheckedChange={() => handleCookTimeFilterChange("long")}
                          />
                          <label htmlFor="long" className="text-sm">Long (over 40 mins)</label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="favorites" 
                        checked={showFavoritesOnly}
                        onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                      />
                      <label htmlFor="favorites" className="text-sm">Show favorites only</label>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matching">Matching Ingredients</SelectItem>
                  <SelectItem value="cookTime">Cook Time</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View toggle */}
            <div className="flex bg-gray-100 p-1 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-md h-8 w-8", 
                  viewMode === "grid" ? "bg-white shadow-sm" : "bg-transparent"
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-md h-8 w-8", 
                  viewMode === "list" ? "bg-white shadow-sm" : "bg-transparent"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {filteredRecipes.length > 0
              ? `Found ${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recipe' : 'recipes'}`
              : "No recipes found"}
          </p>
        </div>
        
        {/* Recipe cards */}
        {filteredRecipes.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-4 bg-white/80 backdrop-blur-sm border">
              <TabsTrigger value="all" className="flex-1">All Recipes</TabsTrigger>
              <TabsTrigger value="grouped" className="flex-1">By Match %</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <motion.div 
                className={cn(
                  "w-full",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                    : "flex flex-col gap-4"
                )}
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredRecipes.map(({ recipe, matchingCount }) => (
                  <motion.div 
                    key={recipe.id} 
                    variants={item}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image}
                      cookTime={recipe.cookTime}
                      matchingIngredients={matchingCount}
                      totalIngredients={recipe.ingredients.length}
                      listView={viewMode === "list"}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="grouped" className="mt-0 space-y-6">
              {/* Perfect Match */}
              {recipeGroups.perfect && recipeGroups.perfect.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600 px-2">Perfect match</Badge>
                    <h3 className="text-sm font-medium text-gray-700">You have all ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "flex flex-col gap-4"
                    )}
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {recipeGroups.perfect.map(({ recipe, matchingCount }) => (
                      <motion.div 
                        key={recipe.id} 
                        variants={item}
                        className={viewMode === "list" ? "w-full" : ""}
                      >
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookTime={recipe.cookTime}
                          matchingIngredients={matchingCount}
                          totalIngredients={recipe.ingredients.length}
                          listView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Good Match */}
              {recipeGroups.good && recipeGroups.good.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-2">Good match</Badge>
                    <h3 className="text-sm font-medium text-gray-700">You have most ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "flex flex-col gap-4"
                    )}
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {recipeGroups.good.map(({ recipe, matchingCount }) => (
                      <motion.div 
                        key={recipe.id} 
                        variants={item}
                        className={viewMode === "list" ? "w-full" : ""}
                      >
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookTime={recipe.cookTime}
                          matchingIngredients={matchingCount}
                          totalIngredients={recipe.ingredients.length}
                          listView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Some Match */}
              {recipeGroups.some && recipeGroups.some.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-2">Some match</Badge>
                    <h3 className="text-sm font-medium text-gray-700">You have some ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "flex flex-col gap-4"
                    )}
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {recipeGroups.some.map(({ recipe, matchingCount }) => (
                      <motion.div 
                        key={recipe.id} 
                        variants={item}
                        className={viewMode === "list" ? "w-full" : ""}
                      >
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookTime={recipe.cookTime}
                          matchingIngredients={matchingCount}
                          totalIngredients={recipe.ingredients.length}
                          listView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* Few Match */}
              {recipeGroups.few && recipeGroups.few.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-500 hover:bg-gray-600 px-2">Few match</Badge>
                    <h3 className="text-sm font-medium text-gray-700">Missing most ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "flex flex-col gap-4"
                    )}
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {recipeGroups.few.map(({ recipe, matchingCount }) => (
                      <motion.div 
                        key={recipe.id} 
                        variants={item}
                        className={viewMode === "list" ? "w-full" : ""}
                      >
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookTime={recipe.cookTime}
                          matchingIngredients={matchingCount}
                          totalIngredients={recipe.ingredients.length}
                          listView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No recipes found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipesView;
