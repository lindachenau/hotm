const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use('/api', proxy({ target: 'https://appvelation.app', changeOrigin: true }));
  app.use('/wp-json', proxy({ target: 'https://appvelation.app', changeOrigin: true }));
  app.use('/charge', proxy({ target: 'http://localhost:9000'}));
}