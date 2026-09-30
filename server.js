const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Carga estática para que Vercel NFT empaquete idolos.json automáticamente
const idolosData = require('./idolos.json');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
          return iface.address;
        }
      }
    }
  }
  return '192.168.0.9';
}

function resolveFilePath(reqPath) {
  const cleanPath = reqPath.replace(/^\/+/, '');
  const candidate1 = path.join(__dirname, cleanPath);
  if (fs.existsSync(candidate1) && fs.statSync(candidate1).isFile()) {
    return candidate1;
  }
  const candidate2 = path.join(process.cwd(), cleanPath);
  if (fs.existsSync(candidate2) && fs.statSync(candidate2).isFile()) {
    return candidate2;
  }
  return null;
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (reqPath === '/favicon.ico') {
    reqPath = '/imagenes/logo_filial_chaco.png';
  }

  // Respuesta directa desde memoria para idolos.json (0ms latencia)
  if (reqPath === '/idolos.json') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(JSON.stringify(idolosData));
    return;
  }

  // Configuración de Firebase (soporta variable de entorno en Vercel o archivo local ignorado en git)
  if (reqPath === '/firebase-config.js') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    if (process.env.FIREBASE_CONFIG) {
      res.end(`window.FIREBASE_CONFIG = ${process.env.FIREBASE_CONFIG};`);
      return;
    }
    const localConfigPath = path.join(__dirname, 'firebase-config.js');
    if (fs.existsSync(localConfigPath)) {
      res.end(fs.readFileSync(localConfigPath, 'utf8'));
      return;
    }
    res.end('window.FIREBASE_CONFIG = null;');
    return;
  }

  const filePath = resolveFilePath(reqPath);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Archivo no encontrado');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const isImage = ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.svg' || ext === '.ico';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': isImage ? 'public, max-age=86400' : 'no-cache'
  });

  fs.createReadStream(filePath).pipe(res);
});

// Exportar para Vercel Serverless
module.exports = server;

// Iniciar servidor local
if (require.main === module || !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`\n=================================================`);
    console.log(` El Oráculo Albiazul corriendo en tu red`);
    console.log(` > En tu PC:     http://localhost:${PORT}/`);
    console.log(` > En tu Celular: http://${localIp}:${PORT}/`);
    console.log(`=================================================\n`);
  });
}
