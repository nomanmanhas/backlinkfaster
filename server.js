const http = require('http');
const fs = require('fs');
const path = require('path');

// Dedicated Port 9999 for SEO Agency (Prevents conflicts with Backlink Faster project)
const PORT = process.env.PORT || 9999;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  let filePath = path.join(PUBLIC_DIR, reqUrl === '/' ? 'index.html' : reqUrl);
  
  if (reqUrl === '/api/network-check') {
    const url = require('url');
    const queryObject = url.parse(req.url, true).query;
    let targetUrl = queryObject.url;
    
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'URL is required' }));
      return;
    }

    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    const https = require('https');
    const httpLib = targetUrl.startsWith('https') ? https : require('http');
    
    try {
      const parsedUrl = new URL(targetUrl);
      const options = {
        method: 'GET',
        headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' },
        rejectUnauthorized: false
      };

      const request = httpLib.request(targetUrl, options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        
        response.on('end', () => {
          const cert = (response.socket && response.socket.getPeerCertificate) ? response.socket.getPeerCertificate() : null;
          let sslDetails = 'Not Secure';
          if (cert && Object.keys(cert).length > 0) {
            const validTo = new Date(cert.valid_to);
            const daysLeft = Math.round((validTo - new Date()) / (1000 * 60 * 60 * 24));
            sslDetails = `Valid (${cert.issuer?.O || 'Verified'}), ${daysLeft} days left`;
          }
          
          let wwwRedirect = 'N/A';
          let httpsRedirect = 'N/A';
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            const loc = response.headers.location;
            if (loc.includes('https://') && targetUrl.includes('http://')) httpsRedirect = 'Active';
            if (loc.includes('www.') && !targetUrl.includes('www.')) wwwRedirect = 'Active';
          }

          const result = {
            httpStatusCode: `${response.statusCode} ${response.statusMessage || ''}`,
            sslDetails: sslDetails,
            wwwRedirect: wwwRedirect === 'N/A' ? 'No Redirect Found' : wwwRedirect,
            httpsRedirect: targetUrl.startsWith('https') ? 'Already Secure' : httpsRedirect,
            htmlSize: `${Math.max(1, Math.round(data.length / 1024))} KB`,
            compression: response.headers['content-encoding'] || 'None',
            securityHeaders: [
              response.headers['strict-transport-security'] ? 'HSTS' : '',
              response.headers['x-frame-options'] ? 'X-Frame-Options' : '',
              response.headers['x-content-type-options'] ? 'X-Content-Type' : ''
            ].filter(Boolean).join(', ') || 'Missing'
          };
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        });
      });
      
      request.on('error', (e) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          httpStatusCode: 'Error',
          sslDetails: 'Unknown',
          wwwRedirect: 'Unknown',
          httpsRedirect: 'Unknown',
          htmlSize: '0 KB',
          compression: 'Unknown',
          securityHeaders: 'Unknown'
        }));
      });
      request.end();
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid URL format' }));
    }
    return;
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(404);
            res.end('File Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n==================================================`);
  console.log(`🚀 SEO Agency Localhost Server Running!`);
  console.log(`🌐 Dedicated URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Portal: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
