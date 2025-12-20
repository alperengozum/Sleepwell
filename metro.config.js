// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Transpile react-native-animated-nav-tab-bar from node_modules
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;

