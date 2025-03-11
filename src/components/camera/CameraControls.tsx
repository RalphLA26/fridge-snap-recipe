
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SwitchCamera, 
  Settings, 
  Grid3x3, 
  X,
  ZoomIn,
  ZoomOut,
  Gauge,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraControlsProps {
  onSwitchCamera: () => void;
  onToggleGrid: () => void;
  onToggleQuality: () => void;
  currentQuality: 'low' | 'medium' | 'high';
  showGrid: boolean;
  isLoading: boolean;
}

const CameraControls = ({ 
  onSwitchCamera, 
  onToggleGrid, 
  onToggleQuality,
  currentQuality,
  showGrid,
  isLoading 
}: CameraControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const getQualityColor = () => {
    switch (currentQuality) {
      case 'low': return 'text-yellow-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={!showSettings ? onSwitchCamera : toggleSettings}
        disabled={isLoading}
        className="rounded-full h-12 w-12 bg-black/50 text-white hover:bg-black/70 border border-white/20"
      >
        {!showSettings ? <SwitchCamera className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Settings button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSettings}
        disabled={isLoading}
        className="absolute -top-16 rounded-full h-10 w-10 bg-black/50 text-white hover:bg-black/70 border border-white/20"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-3 w-48 text-white flex flex-col gap-3 border border-white/10"
          >
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                onClick={onToggleGrid}
                className="justify-between h-10 px-3 hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  <span className="text-sm">Composition Grid</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${showGrid ? 'bg-green-500' : 'bg-gray-500'}`} />
              </Button>
              
              <Button
                variant="ghost"
                onClick={onToggleQuality}
                className="justify-between h-10 px-3 hover:bg-white/10 group"
              >
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span className="text-sm">Quality</span>
                </div>
                <div className={`flex items-center gap-0.5 ${getQualityColor()}`}>
                  <span className="text-xs">
                    {currentQuality.charAt(0).toUpperCase() + currentQuality.slice(1)}
                  </span>
                  <Sparkles className="h-3 w-3" />
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraControls;
