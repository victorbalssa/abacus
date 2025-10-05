import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDefaultConfig } from 'expo/metro-config.js';

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = getDefaultConfig(__dirname);

export default config;
