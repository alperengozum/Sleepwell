if (!process.env.EXPO_PUBLIC_AD_UNIT_ID) {
  console.warn('Warning: EXPO_PUBLIC_AD_UNIT_ID is not set. Please set it in your .env file.');
  console.warn('For development/testing, use: ca-app-pub-3940256099942544/1033173712');
  console.warn('For production, use your actual AdMob ad unit ID.');
}

module.exports = {
  displayName: "Sleepwell",
  name: "Sleepwell",
  slug: "Sleepwell",
  version: "0.4.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.alperengozum.sleepwell"
  },
  android: {
    versionCode: 500000,
    permissions: [
      "com.android.alarm.permission.SET_ALARM"
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#744EAA"
    },
    package: "com.alperengozum.sleepwell",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.alperengozum.sleepwell",
    useLegacyPackaging: false
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-localization"
  ],
  extra: {
    eas: {
      projectId: "8bd61a54-8390-4733-98a7-9fd75385dfe1"
    },
    // Ad unit ID must be set via EXPO_PUBLIC_AD_UNIT_ID environment variable
    // For production, use your real Google AdMob ad unit ID
    // For development/testing, use a test ad unit ID
    adUnitId: process.env.EXPO_PUBLIC_AD_UNIT_ID
  }
};

