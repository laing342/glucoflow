var http = require('http');
var fs = require('fs');
var path = require('path');
var PORT = 3000;
var DIST = process.cwd();
var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json'
};
var server = http.createServer(function(req, res) {
  var reqPath = req.url.split('?')[0];
  var filePath = path.join(DIST, reqPath === '/' ? 'index.html' : reqPath);
  var ext = path.extname(filePath);
  if (!ext || !fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html');
    ext = '.html';
  }
  fs.readFile(filePath, function(err, data) {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});
server.listen(PORT, '0.0.0.0', function() { console.log('GlucoFlow PWA running at http://localhost:' + PORT); });
