import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vtcdispatch.app',
  appName: 'VTC Dispatch',
  webDir: 'dist',
  server: {
    url: 'https://3d0f7271-7b44-4ac9-be75-60d1de24adaa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
