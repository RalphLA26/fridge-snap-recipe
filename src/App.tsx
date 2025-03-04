
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { UserProvider } from "./contexts/UserContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import CameraView from "./pages/CameraView";
import RecipesView from "./pages/RecipesView";
import RecipeDetailView from "./pages/RecipeDetailView";
import ProfileView from "./pages/ProfileView";
import ShoppingListView from "./pages/ShoppingListView";
import NotFound from "./pages/NotFound";

// Create a QueryClient for React Query
const queryClient = new QueryClient();

// AnimatePresence wrapper for route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Apply mobile-specific adjustments
  useEffect(() => {
    // Add safe area insets for mobile devices
    document.body.classList.add('mobile-safe-area');
    console.log("Routes mounted, current path:", location.pathname);
    
    return () => {
      document.body.classList.remove('mobile-safe-area');
    };
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/camera" element={<CameraView />} />
        <Route path="/recipes" element={<RecipesView />} />
        <Route path="/recipe/:id" element={<RecipeDetailView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/shopping-list" element={<ShoppingListView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Enable console debugging for route changes
  useEffect(() => {
    console.log("App component mounted, routes should be working");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="app-container">
              <AnimatedRoutes />
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
