const fs = require('fs');
const path = require('path');
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {
  console.warn('dotenv module not found, skipping .env loading');
}
const http = require('http');
const https = require('https');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 5001;
const dev = process.env.NODE_ENV !== 'production';
console.log("dev", dev);
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS options for production
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
};

app.prepare()
    .then(() => {
        if (dev) {
            // Development: HTTP server
            http
                .createServer((req, res) => {
                    const parsedUrl = parse(req.url, true);
                    handle(req, res, parsedUrl);
                })
                .listen(port, '0.0.0.0', () => {
                    console.log(`> HTTP server ready on http://0.0.0.0:${port} (env: development)`);
                });
        } else {
            // Production: HTTPS server
            https
                .createServer(httpsOptions, (req, res) => {
                    const parsedUrl = parse(req.url, true);
                    handle(req, res, parsedUrl);
                })
                .listen(port, '0.0.0.0', () => {
                    console.log(`> HTTPS server ready on https://0.0.0.0:${port} (env: production)`);
                });
        }
    })
    .catch((err) => {
        console.error('Error starting server', err);
        process.exit(1);
    });
