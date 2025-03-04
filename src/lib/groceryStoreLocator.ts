
// Types for grocery stores
export interface GroceryStore {
  id: string;
  name: string;
  address: string;
  distance: number; // in miles
  inventory: Record<string, { price: number; inStock: boolean }>;
}

// Mock database of nearby grocery stores
const nearbyStores: GroceryStore[] = [
  {
    id: "store1",
    name: "Fresh Market",
    address: "123 Main St, Anytown, USA",
    distance: 0.8,
    inventory: {
      "apple": { price: 1.29, inStock: true },
      "milk": { price: 3.49, inStock: true },
      "eggs": { price: 2.99, inStock: true },
      "bread": { price: 3.99, inStock: true },
      "cheese": { price: 4.99, inStock: false }
    }
  },
  {
    id: "store2",
    name: "Super Foods",
    address: "456 Oak Ave, Anytown, USA",
    distance: 1.2,
    inventory: {
      "apple": { price: 1.19, inStock: true },
      "milk": { price: 3.29, inStock: true },
      "eggs": { price: 3.19, inStock: false },
      "bread": { price: 3.49, inStock: true },
      "cheese": { price: 5.29, inStock: true }
    }
  },
  {
    id: "store3",
    name: "Organic Grocers",
    address: "789 Pine Blvd, Anytown, USA",
    distance: 2.5,
    inventory: {
      "apple": { price: 1.99, inStock: true },
      "milk": { price: 4.99, inStock: true },
      "eggs": { price: 4.99, inStock: true },
      "bread": { price: 5.99, inStock: true },
      "cheese": { price: 7.99, inStock: true }
    }
  }
];

// Find nearby stores
export const findNearbyStores = (): Promise<GroceryStore[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...nearbyStores]);
    }, 1000);
  });
};

// Check item availability at nearby stores
export const checkItemAvailability = (ingredient: string): Promise<Array<{store: GroceryStore, price: number, inStock: boolean}>> => {
  return new Promise((resolve) => {
    // Normalize ingredient (remove quantities, units, etc.)
    const normalizedIngredient = ingredient.replace(/^\d+\s*[\d/]*\s*\w+\s+/, '').trim().toLowerCase();
    
    // Find matching items in stores
    const results = nearbyStores.map(store => {
      // Check for exact or partial matches in inventory
      const match = Object.keys(store.inventory).find(item => 
        normalizedIngredient.includes(item) || item.includes(normalizedIngredient)
      );
      
      if (match) {
        return {
          store,
          price: store.inventory[match].price,
          inStock: store.inventory[match].inStock
        };
      }
      
      // If no match, provide default "unknown" data
      return {
        store,
        price: 0,
        inStock: Math.random() > 0.3 // 70% chance it's in stock
      };
    });
    
    // Sort by distance
    results.sort((a, b) => a.store.distance - b.store.distance);
    
    // Simulate API delay
    setTimeout(() => {
      resolve(results);
    }, 800);
  });
};
