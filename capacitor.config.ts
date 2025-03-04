
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.721a596b630042cc9e7685638689dbc3',
  appName: 'fridge-snap-recipe',
  webDir: 'dist',
  server: {
    url: 'https://721a596b-6300-42cc-9e76-85638689dbc3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
