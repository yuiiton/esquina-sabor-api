import { Router } from 'express';
import { 
  createProduct, 
  listProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from './service.js';
import { productCreateSchema, productUpdateSchema } from './schemas.js';
import { authMiddleware } from '../../core/security.js';

const router = Router();

// Middleware auxiliar para verificar se é admin
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Acesso negado. Apenas administradores podem realizar esta operação.',
      },
    });
  }
  next();
}

// F004 - Listar Produtos (Público)
router.get('/products', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await listProducts(page, limit);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// F005 - Consultar Detalhes do Produto (Público)
router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    return res.status(200).json({
      success: true,
      data: product,
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

// F002 - Cadastrar Produto (Apenas Admin)
router.post('/products', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const validation = productCreateSchema.safeParse(req.body);
    if (!validation.success) {
      const messages = (validation.error.errors || validation.error.issues).map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: messages },
      });
    }

    const product = await createProduct(validation.data);
    return res.status(201).json({
      success: true,
      data: product,
      message: 'Produto cadastrado com sucesso.',
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

// F003 - Atualizar Produto (Apenas Admin)
router.patch('/products/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const validation = productUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      const messages = (validation.error.errors || validation.error.issues).map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: messages },
      });
    }

    const product = await updateProduct(req.params.id, validation.data);
    return res.status(200).json({
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso.',
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

// F006 - Apagar Produto (Apenas Admin)
router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Produto removido com sucesso.',
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