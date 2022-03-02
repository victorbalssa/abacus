const devMode = (process.env.NODE_ENV === 'development');

export default {
  serverURL: devMode ? '[DEV_SERVER_URL]' : '[PROD_SERVER_URL]',
};
