import { getSentryExpoConfig } from '@sentry/react-native/metro';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

config.resolver.sourceExts.push('mjs', 'cjs'); // fixes stable-hash module resolve issue
config.resolver.assetExts.push('db');

module.exports = config;
