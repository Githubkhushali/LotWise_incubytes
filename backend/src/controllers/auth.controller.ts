import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  /**
   * POST /api/auth/register
   * req.body is already validated and transformed by the validate() middleware.
   * The controller's only job: call the service and send the response.
   */
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
}
