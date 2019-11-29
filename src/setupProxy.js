const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use('/api', proxy({ target: 'https://procomhost.com', changeOrigin: true }));
  app.use('/charge', proxy({ target: 'http://localhost:9000'}));
}