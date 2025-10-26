import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vtcdispatch.app',
  appName: 'VTC Dispatch',
  webDir: 'dist',
  // Important: pour charger les assets locaux intégrés dans l'APK, ne pas définir server.url
  // Si vous souhaitez pointer vers un serveur distant en dev, décommentez et adaptez.
  // server: {
  //   url: 'https://example.com',
  //   cleartext: true
  // },
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
