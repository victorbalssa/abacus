import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

function removeNetworkSecurityConfig(androidManifest) {
  const newManifest = { ...androidManifest };

  newManifest.manifest.application[0].$['android:networkSecurityConfig'] = undefined;
  newManifest.manifest.application[0].$['android:usesCleartextTraffic'] = 'true';

  return newManifest;
}

const withAndroidPlugin: ConfigPlugin = (config) => withAndroidManifest(config, (configWithProps) => {
  const mainApplication = configWithProps?.modResults;

  if (mainApplication) {
    // eslint-disable-next-line no-param-reassign
    configWithProps.modResults = removeNetworkSecurityConfig(mainApplication);
  }

  return configWithProps;
});

export default withAndroidPlugin;
