// server.js
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '5001', 10);
const ENABLE_HTTPS = String(process.env.ENABLE_HTTPS).toLowerCase() === 'true';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    if (!dev && ENABLE_HTTPS) {
      const sslOptions = {
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
        ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined,
      };
      https.createServer(sslOptions, (req, res) => handle(req, res))
        .listen(port, '0.0.0.0', () => {
          console.log(`> HTTPS server ready on https://0.0.0.0:${port}`);
        });
    } else {
      http.createServer((req, res) => handle(req, res))
        .listen(port, '0.0.0.0', () => {
          console.log(`> HTTP server ready on http://0.0.0.0:${port}`);
        });
    }
  })
  .catch((err) => {
    console.error('Error starting server', err);
    process.exit(1);
  });
