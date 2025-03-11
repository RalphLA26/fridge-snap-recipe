
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Clock, 
  ListFilter, Grid3X3, List, Heart,
  ArrowUpDown, X, BookOpen, Flame,
  ChevronDown, SlidersHorizontal, GaugeCircle,
  Tag, BookMarked, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  
  // Animation variants
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
      {/* Streamlined header */}
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
                  variant="blue" 
                  className="font-medium px-2.5 py-1"
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
        {/* Main content area */}
        <div className="mb-6">
          {/* Simplified view tabs that stand out more */}
          <Tabs defaultValue="matching" className="w-full mb-4">
            <TabsList className="w-full mb-5 grid grid-cols-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
              <TabsTrigger 
                value="matching" 
                className="py-3 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <GaugeCircle className="h-4 w-4" />
                  Ingredient Matches
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="py-3 data-[state=active]:bg-fridge-600 data-[state=active]:text-white rounded-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Recipes
                </span>
              </TabsTrigger>
            </TabsList>
            
            {/* Enhanced search and filter card */}
            <Card className="mb-5 border-gray-200 shadow-md overflow-hidden">
              <div className="bg-fridge-50 border-b border-fridge-100 p-3">
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fridge-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 py-5 border-0 shadow-none focus-visible:ring-0 bg-white rounded-lg placeholder:text-gray-400"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter control section with icons and clear styling */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white">
                {/* Filters button */}
                <Popover open={filtersVisible} onOpenChange={setFiltersVisible}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "flex items-center gap-2 border-gray-200 h-9 px-3 rounded-lg",
                        activeFilterCount > 0 ? "bg-fridge-50 text-fridge-600 border-fridge-200" : ""
                      )}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filters</span>
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-fridge-100 text-fridge-700">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-4 shadow-xl border-gray-200 rounded-xl w-72">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg text-gray-900">Filters</h3>
                        {activeFilterCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 py-1 text-sm text-fridge-600 hover:text-fridge-800 hover:bg-fridge-50"
                            onClick={clearFilters}
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Cook Time</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {/* Simplified filter checkboxes */}
                          <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Checkbox 
                              id="quick" 
                              checked={cookTimeFilter.includes("quick")}
                              onCheckedChange={() => handleCookTimeFilterChange("quick")}
                              className="text-fridge-600 data-[state=checked]:bg-fridge-600"
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-fridge-600" />
                              <span>Quick (under 20 mins)</span>
                            </div>
                          </label>
                          
                          <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Checkbox 
                              id="medium" 
                              checked={cookTimeFilter.includes("medium")}
                              onCheckedChange={() => handleCookTimeFilterChange("medium")}
                              className="text-fridge-600 data-[state=checked]:bg-fridge-600"
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-fridge-600" />
                              <span>Medium (20-40 mins)</span>
                            </div>
                          </label>
                          
                          <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Checkbox 
                              id="long" 
                              checked={cookTimeFilter.includes("long")}
                              onCheckedChange={() => handleCookTimeFilterChange("long")}
                              className="text-fridge-600 data-[state=checked]:bg-fridge-600"
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-fridge-600" />
                              <span>Long (over 40 mins)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-200" />
                      
                      {/* Favorites filter */}
                      <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <Checkbox 
                          id="favorites" 
                          checked={showFavoritesOnly}
                          onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                          className="text-red-500 data-[state=checked]:bg-red-500"
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
                
                {/* Time filter chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCookTimeFilterChange("quick")}
                    className={cn(
                      "h-9 rounded-lg border-gray-200",
                      cookTimeFilter.includes("quick")
                        ? "bg-fridge-50 text-fridge-600 border-fridge-200"
                        : ""
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Quick
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCookTimeFilterChange("medium")}
                    className={cn(
                      "h-9 rounded-lg border-gray-200",
                      cookTimeFilter.includes("medium")
                        ? "bg-fridge-50 text-fridge-600 border-fridge-200"
                        : ""
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Medium
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCookTimeFilterChange("long")}
                    className={cn(
                      "h-9 rounded-lg border-gray-200",
                      cookTimeFilter.includes("long")
                        ? "bg-fridge-50 text-fridge-600 border-fridge-200"
                        : ""
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Long
                  </Button>
                </div>
                
                {/* Favorites filter chip */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={cn(
                    "h-9 rounded-lg border-gray-200",
                    showFavoritesOnly
                      ? "bg-red-50 text-red-600 border-red-200"
                      : ""
                  )}
                >
                  <Heart className={cn(
                    "h-3.5 w-3.5 mr-1.5",
                    showFavoritesOnly ? "fill-red-500" : ""
                  )} />
                  Favorites
                </Button>
                
                {/* Sort by dropdown with improved styling */}
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as any)}
                >
                  <SelectTrigger className="w-auto h-9 min-w-[135px] border-gray-200 focus:ring-fridge-400 rounded-lg">
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
                
                {/* View toggle with improved visual design */}
                <div className="ml-auto flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-none border-r border-gray-200 px-3 h-9", 
                      viewMode === "grid" 
                        ? "bg-fridge-50 text-fridge-700" 
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
                        ? "bg-fridge-50 text-fridge-700" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Results counter with improved styling */}
              {(filteredRecipes.length > 0 || searchQuery) && (
                <div className="bg-gray-50 px-3 py-2 border-t border-gray-100 flex items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ListFilter className="h-4 w-4 text-fridge-500" />
                    <p>
                      {getMatchingMessage()}
                      {searchQuery && (
                        <span className="text-gray-500 ml-1">
                          for "<span className="font-medium">{searchQuery}</span>"
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Clear filters button - only show if filters are active */}
                  {(activeFilterCount > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-auto h-7 px-2 text-xs text-fridge-600 hover:text-fridge-800 hover:bg-fridge-50"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </Card>
            
            {/* All Recipes Tab */}
            <TabsContent value="all" className="mt-6 animate-in fade-in-50">
              {filteredRecipes.length > 0 ? (
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
              ) : (
                <Card className="text-center py-10 border-gray-200">
                  <CardContent className="pt-6">
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
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Matching Tab */}
            <TabsContent value="matching" className="mt-6 space-y-8 animate-in fade-in-50">
              {/* Better organized recipe groups */}
              {Object.entries(recipeGroups).map(([group, recipes]) => {
                if (recipes.length === 0) return null;
                
                // Determine group appearance based on match level
                const groupInfo = {
                  perfect: {
                    title: "Perfect match",
                    subtitle: "You have all ingredients",
                    border: "border-green-500",
                    bg: "bg-green-50",
                    text: "text-green-800",
                    badge: "bg-green-500 hover:bg-green-600"
                  },
                  good: {
                    title: "Good match",
                    subtitle: "You have most ingredients",
                    border: "border-fridge-500",
                    bg: "bg-fridge-50",
                    text: "text-fridge-800",
                    badge: "bg-fridge-500 hover:bg-fridge-600"
                  },
                  some: {
                    title: "Some match",
                    subtitle: "You have some ingredients",
                    border: "border-amber-500",
                    bg: "bg-amber-50",
                    text: "text-amber-800",
                    badge: "bg-amber-500 hover:bg-amber-600"
                  },
                  few: {
                    title: "Few match",
                    subtitle: "Missing most ingredients",
                    border: "border-gray-500",
                    bg: "bg-gray-50",
                    text: "text-gray-800", 
                    badge: "bg-gray-500 hover:bg-gray-600"
                  }
                };
                
                const info = groupInfo[group as keyof typeof groupInfo];
                
                return (
                  <div key={group} className="space-y-4">
                    <div className={cn(
                      "flex items-center gap-3 border-l-4 pl-3 py-2 rounded-r-lg",
                      info.border, info.bg
                    )}>
                      <Badge className={info.badge}>
                        {info.title}
                      </Badge>
                      <h3 className={cn("font-medium", info.text)}>
                        {info.subtitle}
                      </h3>
                      <Badge variant="outline" className="ml-auto">
                        {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                      </Badge>
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
                      {recipes.map(({ recipe, matchingCount }) => (
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
                );
              })}
              
              {/* No recipes found state */}
              {Object.values(recipeGroups).every(group => group.length === 0) && (
                <Card className="text-center py-10 border-gray-200">
                  <CardContent className="pt-6">
                    <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No matching recipes found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Try adding more ingredients to your inventory or adjusting your filters
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4 border-gray-200"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipesView;
