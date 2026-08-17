import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[API ERROR] ${req.method} ${req.originalUrl}:`, err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';
  return sendError(res, message, status, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}
