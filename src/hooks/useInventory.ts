
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useInventory = () => {
  const navigate = useNavigate();
  
  const saveIngredientsToInventory = useCallback((ingredients: string[]) => {
    try {
      const existingIngredients = JSON.parse(localStorage.getItem("fridgeIngredients") || "[]");
      
      // Combine existing and new ingredients without duplicates
      const updatedIngredients = Array.from(new Set([...existingIngredients, ...ingredients]));
      
      localStorage.setItem("fridgeIngredients", JSON.stringify(updatedIngredients));
      toast.success(`Added ${ingredients.length} ingredients to your fridge`);
      
      // Navigate to inventory view
      navigate("/inventory");
    } catch (error) {
      console.error("Error saving ingredients:", error);
      toast.error("Failed to save ingredients");
    }
  }, [navigate]);
  
  return { saveIngredientsToInventory };
};
