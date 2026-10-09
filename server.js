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
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
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

  // Respuesta directa para idolos.json (recarga dinámica ante cambios)
  if (reqPath === '/idolos.json') {
    const jsonPath = path.join(__dirname, 'idolos.json');
    let dataToSend = idolosData;
    if (fs.existsSync(jsonPath)) {
      try {
        dataToSend = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (e) {
        dataToSend = idolosData;
      }
    }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(dataToSend));
    return;
  }

  // Endpoints de administración exclusivos para entorno local
  if (reqPath === '/api/admin/guardar-figurita' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        if (!item.name) throw new Error('El campo name es obligatorio');
        const jsonPath = path.join(__dirname, 'idolos.json');
        let list = [];
        if (fs.existsSync(jsonPath)) {
          list = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }
        const idx = list.findIndex(p => p.name.trim().toLowerCase() === item.name.trim().toLowerCase());
        if (idx >= 0) {
          list[idx] = item;
        } else {
          list.push(item);
        }
        fs.writeFileSync(jsonPath, JSON.stringify(list, null, 4), 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, count: list.length, item }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/admin/guardar-todos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const list = JSON.parse(body);
        if (!Array.isArray(list)) throw new Error('El cuerpo debe ser un array');
        const jsonPath = path.join(__dirname, 'idolos.json');
        fs.writeFileSync(jsonPath, JSON.stringify(list, null, 4), 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, count: list.length }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/admin/eliminar-figurita' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { name } = JSON.parse(body);
        if (!name) throw new Error('El campo name es obligatorio');
        const jsonPath = path.join(__dirname, 'idolos.json');
        let list = [];
        if (fs.existsSync(jsonPath)) {
          list = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }
        const filtered = list.filter(p => p.name.trim().toLowerCase() !== name.trim().toLowerCase());
        fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 4), 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, count: filtered.length }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
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
      const raw = process.env.FIREBASE_CONFIG.trim().replace(/^;+|;+$/g, '');
      res.end(`window.FIREBASE_CONFIG = ${raw};`);
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

  // Soporte de streaming para videos (HTTP 206 Partial Content para iOS y Android)
  if (ext === '.mp4') {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

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
