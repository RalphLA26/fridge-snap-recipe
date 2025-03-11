
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  favoriteRecipes: string[];
  shoppingList: ShoppingItem[];
  reviews: {
    [recipeId: string]: Review[];
  };
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  isChecked: boolean;
  category?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addToShoppingList: (item: Omit<ShoppingItem, "id">) => void;
  removeFromShoppingList: (itemId: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  clearShoppingList: () => void;
  addReview: (recipeId: string, review: Omit<Review, "id" | "userId" | "userName">) => void;
  deleteReview: (recipeId: string, reviewId: string) => void;
  getRecipeReviews: (recipeId: string) => Review[];
  getRecipeRating: (recipeId: string) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const loadUser = () => {
      const savedUser = localStorage.getItem("fridgeUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Create default user if none exists
        const defaultUser: UserProfile = {
          id: "user-" + Date.now().toString(),
          name: "Guest User",
          email: "",
          favoriteRecipes: [],
          shoppingList: [],
          reviews: {},
        };
        setUser(defaultUser);
        localStorage.setItem("fridgeUser", JSON.stringify(defaultUser));
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem("fridgeUser", JSON.stringify(user));
    }
  }, [user, isLoading]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const addToFavorites = (recipeId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const favorites = [...prev.favoriteRecipes];
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
      }
      return { ...prev, favoriteRecipes: favorites };
    });
  };

  const removeFromFavorites = (recipeId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const favorites = prev.favoriteRecipes.filter((id) => id !== recipeId);
      return { ...prev, favoriteRecipes: favorites };
    });
  };

  const isFavorite = (recipeId: string) => {
    return user?.favoriteRecipes.includes(recipeId) || false;
  };

  const addToShoppingList = (item: Omit<ShoppingItem, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newItem: ShoppingItem = {
        ...item,
        id: Date.now().toString(),
      };
      return { ...prev, shoppingList: [...prev.shoppingList, newItem] };
    });
  };

  const removeFromShoppingList = (itemId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const shoppingList = prev.shoppingList.filter((item) => item.id !== itemId);
      return { ...prev, shoppingList };
    });
  };

  const toggleShoppingItem = (itemId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const shoppingList = prev.shoppingList.map((item) => 
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      );
      return { ...prev, shoppingList };
    });
  };

  const clearShoppingList = () => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, shoppingList: [] };
    });
  };
  
  const addReview = (recipeId: string, review: Omit<Review, "id" | "userId" | "userName">) => {
    setUser((prev) => {
      if (!prev) return null;
      
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        userId: prev.id,
        userName: prev.name,
      };
      
      const existingReviews = prev.reviews[recipeId] || [];
      const otherReviews = existingReviews.filter(r => r.userId !== prev.id);
      
      return {
        ...prev,
        reviews: {
          ...prev.reviews,
          [recipeId]: [...otherReviews, newReview]
        }
      };
    });
  };
  
  const deleteReview = (recipeId: string, reviewId: string) => {
    setUser((prev) => {
      if (!prev || !prev.reviews[recipeId]) return prev;
      
      const updatedReviews = prev.reviews[recipeId].filter(r => r.id !== reviewId);
      
      return {
        ...prev,
        reviews: {
          ...prev.reviews,
          [recipeId]: updatedReviews
        }
      };
    });
  };
  
  const getRecipeReviews = (recipeId: string): Review[] => {
    if (!user || !user.reviews[recipeId]) return [];
    return user.reviews[recipeId];
  };
  
  const getRecipeRating = (recipeId: string): number => {
    const reviews = getRecipeReviews(recipeId);
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(totalRating / reviews.length);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        updateUser,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToShoppingList,
        removeFromShoppingList,
        toggleShoppingItem,
        clearShoppingList,
        addReview,
        deleteReview,
        getRecipeReviews,
        getRecipeRating,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
