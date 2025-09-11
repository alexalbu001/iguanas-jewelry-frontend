const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to your backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:8080',
      changeOrigin: true,
      secure: false, // Allow self-signed certificates
      logLevel: 'debug'
    })
  );
};
