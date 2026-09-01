const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

function addNetworkSecurityConfig(androidManifest) {
  const newManifest = { ...androidManifest };

  newManifest.manifest.application[0].$['android:networkSecurityConfig'] = '@xml/network_security_config';
  newManifest.manifest.application[0].$['android:usesCleartextTraffic'] = 'true';

  return newManifest;
}

function withNetworkSecurityConfigFile(config) {
  return withDangerousMod(config, [
    'android',
    (c) => {
      const xmlDir = resolve(c.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      mkdirSync(xmlDir, { recursive: true });
      writeFileSync(
        resolve(xmlDir, 'network_security_config.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
`,
      );
      return c;
    },
  ]);
}

module.exports = function withAndroidPlugin(config) {
  let newConfig = withAndroidManifest(config, (configWithProps) => {
    const mainApplication = configWithProps?.modResults;

    if (mainApplication) {
    // eslint-disable-next-line no-param-reassign
      configWithProps.modResults = addNetworkSecurityConfig(mainApplication);
    }

    return configWithProps;
  });

  newConfig = withNetworkSecurityConfigFile(newConfig);
  return newConfig;
};
