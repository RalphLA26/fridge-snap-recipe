
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SwitchCamera, 
  Settings, 
  Grid3x3, 
  X,
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
      case 'low': return 'text-yellow-400';
      case 'medium': return 'text-blue-400';
      case 'high': return 'text-green-400';
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
        className="rounded-full h-12 w-12 bg-black/60 text-white hover:bg-black/70 border border-white/30 backdrop-blur-sm shadow-lg"
      >
        {!showSettings ? <SwitchCamera className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Settings button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSettings}
          disabled={isLoading}
          className="absolute -top-16 rounded-full h-10 w-10 bg-black/60 text-white hover:bg-black/70 border border-white/30 backdrop-blur-sm shadow-lg"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-3 w-48 text-white flex flex-col gap-3 border border-white/20 shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={onToggleGrid}
                className="justify-between h-10 px-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  <span className="text-sm">Composition Grid</span>
                </div>
                <motion.div 
                  className={`w-3 h-3 rounded-full ${showGrid ? 'bg-green-500' : 'bg-gray-500'}`}
                  animate={{ scale: showGrid ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: showGrid ? 2 : 0 }}
                />
              </Button>
              
              <Button
                variant="ghost"
                onClick={onToggleQuality}
                className="justify-between h-10 px-3 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span className="text-sm">Quality</span>
                </div>
                <motion.div 
                  className={`flex items-center gap-0.5 ${getQualityColor()}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-xs font-medium">
                    {currentQuality.charAt(0).toUpperCase() + currentQuality.slice(1)}
                  </span>
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1] 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.div>
                </motion.div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraControls;
