import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../dto/auth.dto';

const router = Router();

// validate() runs first — short-circuits with 400 if body is invalid.
// AuthController.register only runs when the body is clean.
router.post('/register', validate(registerSchema), AuthController.register);

router.post('/login', validate(loginSchema), AuthController.login);

export default router;
