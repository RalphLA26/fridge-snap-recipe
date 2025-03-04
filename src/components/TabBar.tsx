
import { Home, Camera, BookOpen, ShoppingBag, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const TabBar = () => {
  const tabs = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/recipes",
      icon: BookOpen,
      label: "Recipes",
    },
    {
      path: "/camera",
      icon: Camera,
      label: "Camera",
    },
    {
      path: "/shopping-list",
      icon: ShoppingBag,
      label: "Shopping",
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 pb-safe">
      <div className="flex justify-between px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 flex-1 relative ${
                isActive ? "text-fridge-600" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-1 inset-x-3 h-0.5 bg-fridge-600 rounded-full"
                    initial={false}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <tab.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
