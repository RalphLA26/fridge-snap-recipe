
import { Refrigerator } from "lucide-react";

const HomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-fridge-500 to-fridge-600 p-6 rounded-xl shadow-md text-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Refrigerator className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">FridgeSnap</h1>
      </div>
      
      <p className="text-white/90 text-sm leading-relaxed">
        Turn your ingredients into delicious recipes with just a snap.
      </p>
    </div>
  );
};

export default HomeBanner;
