require('dotenv/config');

module.exports = {
  displayName: "Sleepwell",
  name: "Sleepwell",
  slug: "Sleepwell",
  version: "0.3.2",
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
    adUnitId: process.env.EXPO_PUBLIC_AD_UNIT_ID || "ca-app-pub-3940256099942544/1033173712"
  }
};

