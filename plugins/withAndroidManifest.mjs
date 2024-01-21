// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAndroidManifest } = require('@expo/config-plugins');

function removeNetworkSecurityConfig(androidManifest) {
  const manifest = { ...androidManifest };

  manifest.manifest.application[0].$['android:networkSecurityConfig'] = undefined;
  manifest.manifest.application[0].$['android:usesCleartextTraffic'] = 'true';

  return manifest;
}

module.exports = function withAndroidManifestUpdate(configuration) {
  return withAndroidManifest(configuration, (config) => {
    // eslint-disable-next-line no-param-reassign
    config.modResults = removeNetworkSecurityConfig(config.modResults);
    return config;
  });
};
