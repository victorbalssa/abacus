// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAndroidManifest } = require('@expo/config-plugins');

function removeNetworkSecurityConfig(androidManifest) {
  const newManifest = { ...androidManifest };

  newManifest.manifest.application[0].$['android:networkSecurityConfig'] = undefined;
  newManifest.manifest.application[0].$['android:usesCleartextTraffic'] = 'true';

  return newManifest;
}

module.exports = function withAndroidManifestUpdate(configuration) {
  return withAndroidManifest(configuration, (config) => {
    const newConfig = { ...config };

    newConfig.modResults = removeNetworkSecurityConfig(newConfig.modResults);

    return newConfig;
  });
};
