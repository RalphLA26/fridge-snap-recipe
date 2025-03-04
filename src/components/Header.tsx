
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, User, Package } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <header className="py-4 px-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="container max-w-xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fridge-700 flex items-center">
          <svg className="w-7 h-7 mr-2 text-fridge-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
          </svg>
          FridgeSnap
        </h1>
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/inventory")}
            className="relative bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer"
            type="button"
          >
            <Package className="h-5 w-5 text-fridge-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/recipes")}
            className="relative bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer"
            type="button"
          >
            <BookOpen className="h-5 w-5 text-fridge-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/shopping-list")}
            className="relative bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer"
            type="button"
          >
            <ShoppingBag className="h-5 w-5 text-fridge-700" />
            {user?.shoppingList.length ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {user.shoppingList.length}
              </span>
            ) : null}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            className="bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer"
            type="button"
          >
            <User className="h-5 w-5 text-fridge-700" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
