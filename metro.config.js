const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações para resolver problemas de tunnel
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configurações de timeout para evitar problemas de rede
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Aumentar timeout para requests
      req.setTimeout(30000);
      res.setTimeout(30000);
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
