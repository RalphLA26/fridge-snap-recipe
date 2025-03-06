
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, User, Package, Home } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  
  // Check if the current path matches a specific route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="py-4 px-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="container max-w-xl mx-auto flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-bold text-fridge-700 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
          whileTap={{ scale: 0.98 }}
        >
          <motion.svg 
            className="w-7 h-7 mr-2 text-fridge-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
          </motion.svg>
          FridgeSnap
        </motion.h1>
        <nav className="flex space-x-3">
          <NavButton
            icon={<Home className="h-5 w-5 text-fridge-700" />}
            path="/"
            isActive={isActive("/")}
            onClick={() => navigate("/")}
            label="Home"
          />
          <NavButton
            icon={<Package className="h-5 w-5 text-fridge-700" />}
            path="/inventory"
            isActive={isActive("/inventory")}
            onClick={() => navigate("/inventory")}
            label="Inventory"
          />
          <NavButton
            icon={<BookOpen className="h-5 w-5 text-fridge-700" />}
            path="/recipes"
            isActive={isActive("/recipes")}
            onClick={() => navigate("/recipes")}
            label="Recipes"
          />
          <NavButton
            icon={<ShoppingBag className="h-5 w-5 text-fridge-700" />}
            path="/shopping-list"
            isActive={isActive("/shopping-list")}
            onClick={() => navigate("/shopping-list")}
            badge={user?.shoppingList.length || 0}
            label="Shopping"
          />
          <NavButton
            icon={<User className="h-5 w-5 text-fridge-700" />}
            path="/profile"
            isActive={isActive("/profile")}
            onClick={() => navigate("/profile")}
            label="Profile"
          />
        </nav>
      </div>
    </header>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  label: string;
}

const NavButton = ({ icon, isActive, onClick, badge, label }: NavButtonProps) => (
  <Button 
    variant="ghost" 
    size="icon" 
    onClick={onClick}
    className={`relative ${isActive ? "bg-fridge-100" : "bg-gray-50"} hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer`}
    title={label}
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.div>
    {badge ? (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
      >
        {badge}
      </motion.span>
    ) : null}
  </Button>
);

export default Header;
