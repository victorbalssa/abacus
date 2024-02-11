import { getDefaultConfig } from 'expo/metro-config';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

config.resolver.sourceExts.push('mjs', 'cjs'); // fixes stable-hash module resolve issue
config.resolver.assetExts.push('db');

module.exports = config;
