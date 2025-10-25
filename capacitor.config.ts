import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3d0f72717b444ac9be7560d1de24adaa',
  appName: 'chauffeur-control-center',
  webDir: 'dist',
  server: {
    url: 'https://3d0f7271-7b44-4ac9-be75-60d1de24adaa.lovableproject.com?forceHideBadge=true',
    cleartext: false  // SÉCURITÉ: Forcer HTTPS uniquement
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
