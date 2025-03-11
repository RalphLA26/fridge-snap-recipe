
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, SlidersHorizontal, Clock, 
  ListFilter, Grid3X3, List, ChevronDown, Heart,
  ArrowUpDown, X, BookOpen, Flame
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
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Recipes</h1>
          <AnimatePresence>
            {ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Badge 
                  variant="outline" 
                  className="bg-fridge-50 text-fridge-700 border-fridge-200 font-medium"
                >
                  {ingredients.length} ingredients
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      <div className="container max-w-5xl mx-auto p-4">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              className="pl-10 bg-white border-gray-200 shadow-sm focus-visible:ring-fridge-400 placeholder:text-gray-400"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            {/* Left side: Filter button and Sort dropdown */}
            <div className="flex items-center gap-2">
              <Popover open={filtersVisible} onOpenChange={setFiltersVisible}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "flex items-center gap-2 border-gray-200 shadow-sm",
                      activeFilterCount > 0 ? "bg-fridge-50 text-fridge-700 border-fridge-200" : ""
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center bg-fridge-100 text-fridge-700">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 shadow-lg border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Filters</h3>
                      {activeFilterCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 text-sm text-fridge-600 hover:text-fridge-800 hover:bg-transparent"
                          onClick={clearFilters}
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">Cook Time</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="quick" 
                            checked={cookTimeFilter.includes("quick")}
                            onCheckedChange={() => handleCookTimeFilterChange("quick")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <label htmlFor="quick" className="text-sm flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            Quick (under 20 mins)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="medium" 
                            checked={cookTimeFilter.includes("medium")}
                            onCheckedChange={() => handleCookTimeFilterChange("medium")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <label htmlFor="medium" className="text-sm flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            Medium (20-40 mins)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="long" 
                            checked={cookTimeFilter.includes("long")}
                            onCheckedChange={() => handleCookTimeFilterChange("long")}
                            className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                          />
                          <label htmlFor="long" className="text-sm flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            Long (over 40 mins)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-200" />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="favorites" 
                        checked={showFavoritesOnly}
                        onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                        className="text-fridge-600 border-gray-300 data-[state=checked]:bg-fridge-600"
                      />
                      <label htmlFor="favorites" className="text-sm flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-red-500" />
                        Favorites only
                      </label>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-fridge-600 hover:bg-fridge-700 text-white"
                      onClick={() => setFiltersVisible(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger className="w-[190px] border-gray-200 shadow-sm focus:ring-fridge-400 h-9">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matching">Matching Ingredients</SelectItem>
                  <SelectItem value="cookTime">Cook Time</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side: View toggle */}
            <div className="flex bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none border-r border-gray-200 px-3 h-9", 
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
                  "rounded-none px-3 h-9", 
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
        </div>
        
        {/* Search results count */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-gray-400" />
              {filteredRecipes.length > 0
                ? <>Found <span className="font-medium text-gray-700">{filteredRecipes.length}</span> {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}</>
                : "No recipes found"}
              {searchQuery && (
                <span className="text-gray-400">
                  for "<span className="italic">{searchQuery}</span>"
                </span>
              )}
            </p>
          </motion.div>
        </div>
        
        {/* Recipe tabs */}
        {filteredRecipes.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-6 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <TabsTrigger 
                value="all" 
                className="flex-1 py-2.5 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Recipes
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="grouped" 
                className="flex-1 py-2.5 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <Flame className="h-4 w-4" />
                  By Match %
                </span>
              </TabsTrigger>
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
            
            <TabsContent value="grouped" className="mt-0 space-y-8">
              {/* Perfect Match */}
              {recipeGroups.perfect && recipeGroups.perfect.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-l-4 border-green-500 pl-3 py-1">
                    <Badge className="bg-green-500 hover:bg-green-600 px-2 py-0.5">
                      Perfect match
                    </Badge>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 py-1">
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-2 py-0.5">
                      Good match
                    </Badge>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 py-1">
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-2 py-0.5">
                      Some match
                    </Badge>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-l-4 border-gray-500 pl-3 py-1">
                    <Badge className="bg-gray-500 hover:bg-gray-600 px-2 py-0.5">
                      Few match
                    </Badge>
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
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
      </div>
    </motion.div>
  );
};

export default RecipesView;
