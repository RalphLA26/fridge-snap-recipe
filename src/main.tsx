
import { createRoot } from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import App from './App.tsx';
import './index.css';
import { LoadingSpinner } from './components/ui/loading-spinner.tsx';

// Global loading spinner
const GlobalLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white">
    <LoadingSpinner 
      size="lg" 
      color="fridge" 
      text="Starting FridgeSnap..." 
    />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<GlobalLoader />}>
      <App />
    </Suspense>
  </StrictMode>
);
