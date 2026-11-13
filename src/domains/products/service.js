import prisma from '../../core/database.js';

export async function createProduct(data) {
  const existingProduct = await prisma.product.findUnique({
    where: { name: data.name },
  });

  if (existingProduct) {
    const error = new Error('Já existe um produto com o mesmo nome.');
    error.statusCode = 409;
    error.code = 'PRODUCT_ALREADY_EXISTS';
    throw error;
  }

  return await prisma.product.create({ data });
}

export async function listProducts(page = 1, limit = 10) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Apenas produtos disponíveis aparecem na listagem pública (F004)
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: { available: true },
      skip,
      take,
      orderBy: { name: 'asc' },
    }),
    prisma.product.count({ where: { available: true } }),
  ]);

  return {
    items,
    page: Number(page),
    limit: Number(limit),
    total,
  };
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    const error = new Error('Produto não encontrado.');
    error.statusCode = 404;
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  return product;
}

export async function updateProduct(id, data) {
  await getProductById(id); // Valida se existe

  if (data.name) {
    const existing = await prisma.product.findFirst({
      where: { name: data.name, NOT: { id: Number(id) } },
    });
    if (existing) {
      const error = new Error('Já existe outro produto com este nome.');
      error.statusCode = 409;
      error.code = 'PRODUCT_ALREADY_EXISTS';
      throw error;
    }
  }

  return await prisma.product.update({
    where: { id: Number(id) },
    data,
  });
}

export async function deleteProduct(id) {
  await getProductById(id); // Valida se existe

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return true;
}