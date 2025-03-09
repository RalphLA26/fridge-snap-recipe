
import { Refrigerator } from "lucide-react";

const HomeBanner = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-fridge-100 p-2 rounded-lg">
          <Refrigerator className="h-6 w-6 text-fridge-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">FridgeSnap</h1>
      </div>
      
      <p className="text-gray-600 text-sm">
        Turn your ingredients into delicious recipes
      </p>
    </div>
  );
};

export default HomeBanner;
