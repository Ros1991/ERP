import { Request, Response, NextFunction } from 'express';
import { validateDto, validatePartialDto } from './validateDto';

/**
 * Middleware to validate request body using DTO
 */
export function validateBody<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await validateDto(dtoClass, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to validate partial request body using DTO (for updates)
 */
export function validatePartialBody<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await validatePartialDto(dtoClass, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

