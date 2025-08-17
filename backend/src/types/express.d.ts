import 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      empresaId?: number;
    }
  }
}
