import { Request, Response } from 'express';
import app from '../../server/src/index';

export default function handler(req: Request, res: Response) {
  if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    urlObj.pathname = `/api/auth/${subpath}`;
    req.url = `${urlObj.pathname}${urlObj.search}`;
  } else if (!req.url || req.url === '/' || req.url.startsWith('/?')) {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    urlObj.pathname = '/api/auth';
    req.url = `${urlObj.pathname}${urlObj.search}`;
  }
  return app(req, res);
}
