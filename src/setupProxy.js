const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use('/api/auth/generate_auth_cookie', proxy({ target: 'https://procomhost.com', changeOrigin: true }));
  app.use('/api/get_nonce/?controller=user&method=register', proxy({ target: 'https://procomhost.com', changeOrigin: true }));
  app.use('/api/user/register', proxy({ target: 'https://procomhost.com', changeOrigin: true }));
  app.use('/charge', proxy({ target: 'http://localhost:9000'}));
}