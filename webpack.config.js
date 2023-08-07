// eslint-disable-next-line @typescript-eslint/no-var-requires
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// eslint-disable-next-line func-names
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Use babel specifically on victory-native files
  config.module.rules.push({
    test: /.*victory-native\/.*\.js/,
    use: {
      loader: 'babel-loader',
    },
  });

  return config;
};
