
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { UserProvider } from "./contexts/UserContext";
import { useEffect, Suspense, lazy } from "react";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load pages for better performance
const CameraView = lazy(() => import("./pages/CameraView"));
const RecipesView = lazy(() => import("./pages/RecipesView"));
const RecipeDetailView = lazy(() => import("./pages/RecipeDetailView"));
const ProfileView = lazy(() => import("./pages/ProfileView"));
const ShoppingListView = lazy(() => import("./pages/ShoppingListView"));
const InventoryView = lazy(() => import("./pages/InventoryView"));
const SearchView = lazy(() => import("./pages/SearchView"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for suspense
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-10 w-10 animate-spin text-fridge-600" />
      <p className="text-sm text-gray-500">Loading page...</p>
    </div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/camera" element={<CameraView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/recipes" element={<RecipesView />} />
          <Route path="/recipe/:id" element={<RecipeDetailView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/shopping-list" element={<ShoppingListView />} />
          <Route path="/inventory" element={<InventoryView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
            <div className="app-container bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"> 
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
