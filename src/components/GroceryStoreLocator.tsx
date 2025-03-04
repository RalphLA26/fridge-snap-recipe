
import { useState, useEffect } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { checkItemAvailability, GroceryStore } from "@/lib/groceryStoreLocator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GroceryStoreLocatorProps {
  ingredient: string;
}

const GroceryStoreLocator = ({ ingredient }: GroceryStoreLocatorProps) => {
  const [loading, setLoading] = useState(false);
  const [storeResults, setStoreResults] = useState<Array<{
    store: GroceryStore;
    price: number;
    inStock: boolean;
  }> | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  const checkAvailability = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const results = await checkItemAvailability(ingredient);
      setStoreResults(results);
      setExpanded(true);
    } catch (error) {
      toast.error("Failed to check store availability");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto font-normal"
        onClick={expanded ? () => setExpanded(false) : checkAvailability}
      >
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-fridge-600" />
          <span>Find "{ingredient}" at local stores</span>
        </div>
        <span className="text-xs text-gray-500">{expanded ? "Hide" : "Check"}</span>
      </Button>
      
      {expanded && storeResults && (
        <div className="p-4 pt-0 bg-gray-50">
          <div className="space-y-3 mt-2">
            {storeResults.map((result) => (
              <div 
                key={result.store.id}
                className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">{result.store.name}</p>
                  <p className="text-gray-500 text-xs">{result.store.distance.toFixed(1)} miles away</p>
                </div>
                <div className="text-right">
                  {result.price > 0 && (
                    <p className="font-medium text-sm">${result.price.toFixed(2)}</p>
                  )}
                  <p className={`text-xs ${result.inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {result.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button 
                variant="link" 
                className="text-xs flex items-center text-gray-600 p-0 h-auto"
                onClick={() => window.open('https://maps.google.com', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in Maps
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="p-4 flex justify-center">
          <div className="w-5 h-5 border-2 border-fridge-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default GroceryStoreLocator;
