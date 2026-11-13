import { Router } from 'express';
import { createOrder } from './service.js';
import { orderCreateSchema } from './schemas.js';
import { authMiddleware } from '../../core/security.js';

const router = Router();

// F007 - Efetivar Pedido (Requer Autenticação)
router.post('/orders', authMiddleware, async (req, res, next) => {
  try {
    const validation = orderCreateSchema.safeParse(req.body);
    if (!validation.success) {
      const messages = (validation.error.errors || validation.error.issues).map((e) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: messages },
      });
    }

    // O userId é extraído diretamente do token JWT decodificado no authMiddleware
    const userId = req.user.sub;
    const { items } = validation.data;

    const order = await createOrder(userId, items);

    return res.status(201).json({
      success: true,
      data: {
        id: order.id,
        userId: order.userId,
        status: order.status,
        createdAt: order.createdAt,
        total: order.total,
        items: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      },
      message: 'Pedido realizado com sucesso.',
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        error: { code: error.code, message: error.message },
      });
    }
    next(error);
  }
});

export default router;