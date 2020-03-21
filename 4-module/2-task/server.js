const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const fileExistHandler = (filepath, fileExistCallback, fileNotExistCallback) => {
  fs.access(filepath, (err) => {
    if (err) {
      fileNotExistCallback(err);
    } else {
      fileExistCallback();
    }
  });
};

server.on('request', (request, response) => {
  const pathname = url.parse(request.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isNestedPath = pathname.split('/').length >= 2;

  if (isNestedPath) {
    response.statusCode = 400;
    response.end();
    return;
  }

  switch (request.method) {
    case 'GET': {
      fileExistHandler(filepath,
          () => {
            fs.createReadStream(filepath).pipe(response);
          },
          () => {
            response.statusCode = 404;
            response.end('File doesn\'t exist');
          }
      );
      break;
    }

    case 'POST':
      fileExistHandler(filepath,
          () => {
            response.statusCode = 409;
            response.end('File already exist');
          },
          () => {
            const limitStream = new LimitSizeStream({
              limit: 1024,
              encoding: 'utf-8',
            });

            request.on('data', (chunk) => {
              limitStream.write(chunk);
            });

            limitStream.on('error', () => {
              response.statusCode = 413;
              response.end();
            });

            request.on('end', () => {
              limitStream.end();
            });

            limitStream.on('end', () => {
              console.log('!END!');

              // some file write logic here
            });
          }
      );
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }
});

module.exports = server;
