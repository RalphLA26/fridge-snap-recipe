
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, SlidersHorizontal, Clock, 
  ListFilter, Grid3X3, List, ChevronDown, Heart,
  ArrowUpDown, X, BookOpen, Flame, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [filtersVisible, setFiltersVisible] = useState(false);
  
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
  
  // Function to get the active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (cookTimeFilter.length > 0) count += 1;
    if (showFavoritesOnly) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  
  // Get matching message based on recipe count
  const getMatchingMessage = () => {
    if (filteredRecipes.length === 0) {
      return "No recipes found";
    }
    if (filteredRecipes.length === 1) {
      return "Found 1 recipe";
    }
    return `Found ${filteredRecipes.length} recipes`;
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Improved header with cleaner spacing and visual hierarchy */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Recipes</h1>
          </div>
          
          <AnimatePresence>
            {ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Badge 
                  variant="outline" 
                  className="bg-fridge-50 text-fridge-700 border-fridge-200 font-medium px-2.5 py-1"
                >
                  <Flame className="w-3.5 h-3.5 mr-1" />
                  {ingredients.length} ingredients
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Completely redesigned search and filter section */}
        <div className="mb-8 space-y-5">
          {/* Modern search input with improved visual hierarchy */}
          <div className="relative">
            <Input
              className="pl-11 pr-11 py-6 bg-white border border-gray-200 shadow-sm rounded-xl focus-visible:ring-fridge-400 placeholder:text-gray-400 text-base"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            {searchQuery && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Tabs for view selection placed above filters */}
          <Tabs defaultValue="all" className="w-full mb-4">
            <TabsList className="w-full mb-4 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
              <TabsTrigger 
                value="all" 
                className="flex-1 py-3 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Recipes
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="grouped" 
                className="flex-1 py-3 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <Flame className="h-4 w-4" />
                  Match Groups
                </span>
              </TabsTrigger>
            </TabsList>
          
            {/* Clean filter bar with improved spacing */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Simplified filter button with clear indication of active state */}
              <Popover open={filtersVisible} onOpenChange={setFiltersVisible}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "flex items-center gap-2 border-gray-200 shadow-sm h-10 px-4 rounded-lg",
                      activeFilterCount > 0 ? "bg-fridge-50 text-fridge-600 border-fridge-200" : ""
                    )}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-fridge-100 text-fridge-700">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-5 shadow-lg border-gray-200 rounded-xl">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg text-gray-900">Filters</h3>
                      {activeFilterCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto px-2 py-1 text-sm text-fridge-600 hover:text-fridge-800 hover:bg-fridge-50"
                          onClick={clearFilters}
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">Cook Time</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {/* Redesigned filter checkboxes with consistent styling */}
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                          <Checkbox 
                            id="quick" 
                            checked={cookTimeFilter.includes("quick")}
                            onCheckedChange={() => handleCookTimeFilterChange("quick")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-fridge-600" />
                            <span>Quick (under 20 mins)</span>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                          <Checkbox 
                            id="medium" 
                            checked={cookTimeFilter.includes("medium")}
                            onCheckedChange={() => handleCookTimeFilterChange("medium")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-fridge-600" />
                            <span>Medium (20-40 mins)</span>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                          <Checkbox 
                            id="long" 
                            checked={cookTimeFilter.includes("long")}
                            onCheckedChange={() => handleCookTimeFilterChange("long")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-fridge-600" />
                            <span>Long (over 40 mins)</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-200" />
                    
                    {/* Favorites filter with improved visual design */}
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Checkbox 
                        id="favorites" 
                        checked={showFavoritesOnly}
                        onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                        className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                      />
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Favorites only</span>
                      </div>
                    </label>
                    
                    <Button 
                      className="w-full bg-fridge-600 hover:bg-fridge-700 text-white"
                      onClick={() => setFiltersVisible(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Improved sort dropdown with better visual hierarchy */}
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger className="w-auto min-w-[180px] border-gray-200 shadow-sm focus:ring-fridge-400 h-10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-200">
                  <SelectItem value="matching">Matching Ingredients</SelectItem>
                  <SelectItem value="cookTime">Cook Time</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Cleaner view toggle design */}
              <div className="ml-auto flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-none border-r border-gray-200 px-3 h-10", 
                    viewMode === "grid" 
                      ? "bg-fridge-50 text-fridge-700 hover:bg-fridge-100" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-none px-3 h-10", 
                    viewMode === "list" 
                      ? "bg-fridge-50 text-fridge-700 hover:bg-fridge-100" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          
            {/* Results counter with improved visibility */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 mb-3"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                <ListFilter className="h-4 w-4 text-fridge-500" />
                <p className="text-sm text-gray-700">
                  {getMatchingMessage()}
                  {searchQuery && (
                    <span className="text-gray-500 ml-1">
                      for "<span className="italic font-medium">{searchQuery}</span>"
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
            
            <TabsContent value="all" className="mt-5">
              <motion.div 
                className={cn(
                  "w-full",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
                    : "flex flex-col gap-4"
                )}
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map(({ recipe, matchingCount }) => (
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No recipes found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4 border-gray-200"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="grouped" className="mt-5 space-y-8">
              {/* Perfect Match with improved visual design */}
              {recipeGroups.perfect && recipeGroups.perfect.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
                    <Badge className="bg-green-500 hover:bg-green-600 px-2.5 py-1">
                      Perfect match
                    </Badge>
                    <h3 className="font-medium text-green-800">You have all ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
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
              
              {/* Good Match with improved visual design */}
              {recipeGroups.good && recipeGroups.good.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-2.5 py-1">
                      Good match
                    </Badge>
                    <h3 className="font-medium text-blue-800">You have most ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
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
              
              {/* Some Match with improved visual design */}
              {recipeGroups.some && recipeGroups.some.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 rounded-r-lg">
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-2.5 py-1">
                      Some match
                    </Badge>
                    <h3 className="font-medium text-amber-800">You have some ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
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
              
              {/* Few Match with improved visual design */}
              {recipeGroups.few && recipeGroups.few.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-l-4 border-gray-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                    <Badge className="bg-gray-500 hover:bg-gray-600 px-2.5 py-1">
                      Few match
                    </Badge>
                    <h3 className="font-medium text-gray-800">Missing most ingredients</h3>
                  </div>
                  
                  <motion.div 
                    className={cn(
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
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
              
              {/* No recipes found state */}
              {Object.values(recipeGroups).every(group => group.length === 0) && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No recipes found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                  <Button 
                    variant="outline"
                    className="mt-4 border-gray-200"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipesView;
