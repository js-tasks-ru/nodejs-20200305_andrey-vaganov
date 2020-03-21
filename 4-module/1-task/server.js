const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isNestedPath = pathname.split('/').length >= 2;

  if (isNestedPath) {
    res.statusCode = 400;
    res.end('Nested path is deprecated');
  }

  switch (req.method) {
    case 'GET': {
      fs.access(filepath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File doesn\'t exist');
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      });

      break;
    }

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
