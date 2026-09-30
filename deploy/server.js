// ==============================================================================
// ENTRYPOINT SERVEUR HOSTINGER - MARIAGE RADÈNE & KÉVIN
// ==============================================================================

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Erreur lors du traitement de la requête :', req.url, err);
      res.statusCode = 500;
      res.end('Erreur interne du serveur');
    }
  })
    .once('error', (err) => {
      console.error('Erreur du serveur HTTP :', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✨ Serveur Mariage Radène & Kévin prêt sur http://${hostname}:${port}`);
    });
});
