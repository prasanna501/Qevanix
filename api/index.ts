import { Request, Response } from 'express';
import app from '../server/src/index';

export default function handler(req: Request, res: Response) {
  if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'] as string;
  } else if (req.headers['x-forwarded-uri']) {
    req.url = req.headers['x-forwarded-uri'] as string;
  } else if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = `/api/${subpath}`;
  }
  return app(req, res);
}
