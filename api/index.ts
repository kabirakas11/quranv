import app from '../src/server/app.ts';

export default function handler(req: any, res: any) {
  try {
    // In case Vercel rewrite passes url without /api prefix
    if (req.url && !req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel API Handler Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', message: err?.message || String(err) });
    }
  }
}

