
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onCameraClick: () => void;
}

const QuickActions = ({ onCameraClick }: QuickActionsProps) => {
  return (
    <Button
      onClick={onCameraClick}
      className="w-full py-8 text-xl flex items-center justify-center gap-3 bg-fridge-500 hover:bg-fridge-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
      type="button"
    >
      <Camera className="w-8 h-8 text-white" />
      <span>Scan My Fridge</span>
    </Button>
  );
};

export default QuickActions;
