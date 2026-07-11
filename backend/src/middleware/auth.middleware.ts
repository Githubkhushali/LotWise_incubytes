import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user payload from JWT
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: implement
  next();
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: implement
    next();
  };
};
