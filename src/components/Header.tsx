
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, User, Package, Home } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  
  // Check if the current path matches a specific route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="py-4 px-4 bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="container max-w-3xl mx-auto flex items-center justify-between">
        <div 
          className="text-2xl font-bold text-fridge-600 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg 
            className="w-7 h-7 mr-2 text-fridge-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
          </svg>
          FridgeSnap
        </div>
        <nav className="flex space-x-5">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className={`hover:bg-transparent ${isActive("/") ? "text-fridge-600" : "text-gray-400"}`}
            title="Home"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/inventory")}
            className={`hover:bg-transparent ${isActive("/inventory") ? "text-fridge-600" : "text-gray-400"}`}
            title="Inventory"
          >
            <Package className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/recipes")}
            className={`hover:bg-transparent ${isActive("/recipes") ? "text-fridge-600" : "text-gray-400"}`}
            title="Recipes"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/shopping-list")}
            className={`hover:bg-transparent relative ${isActive("/shopping-list") ? "text-fridge-600" : "text-gray-400"}`}
            title="Shopping List"
          >
            <ShoppingBag className="h-5 w-5" />
            {user?.shoppingList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {user.shoppingList.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/profile")}
            className={`hover:bg-transparent ${isActive("/profile") ? "text-fridge-600" : "text-gray-400"}`}
            title="Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
