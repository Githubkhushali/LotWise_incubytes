import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Returns an Express middleware that validates req.body against the given
 * Zod schema. On failure it sends 400 with field-level errors and short-
 * circuits — the route handler is never called. On success it replaces
 * req.body with the parsed (and potentially transformed) output so
 * downstream handlers always receive clean data.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Flatten Zod's issue list into { fieldName: [errorMessage, ...] }
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? 'unknown');
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      }
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    req.body = result.data;
    next();
  };
}
