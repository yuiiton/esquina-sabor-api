import { Router } from 'express';
import { loginOrRegister } from './service.js';
import { loginSchema } from './schemas.js';

const router = Router();

router.post('/auth/login', async (req, res, next) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: (validationResult.error.errors || validationResult.error.issues).map((e) => e.message).join(', '),
        },
      });
    }

    const { name, cpf } = validationResult.data;
    const result = await loginOrRegister({ name, cpf });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login realizado com sucesso.',
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code || 'UNAUTHORIZED',
          message: error.message,
        },
      });
    }
    next(error);
  }
});

export default router;