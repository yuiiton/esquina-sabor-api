import prisma from '../../core/database.js';

export async function createOrder(userId, itemsData) {
  // Valida e busca todos os produtos referenciados no pedido de uma vez
  const productIds = itemsData.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // Verifica se todos os produtos existem e estão disponíveis
  for (const item of itemsData) {
    const product = products.find((p) => p.id === item.productId);
    
    if (!product) {
      const error = new Error(`Produto com ID ${item.productId} não foi encontrado.`);
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    if (!product.available) {
      const error = new Error(`O produto "${product.name}" não está disponível para compra.`);
      error.statusCode = 409;
      error.code = 'PRODUCT_UNAVAILABLE';
      throw error;
    }
  }

  // Calcula o valor total e prepara os itens com o preço unitário atual do banco
  let total = 0;
  const orderItemsData = itemsData.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = product.price;
    total += unitPrice * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: unitPrice,
    };
  });

  // Cria o pedido e seus itens em uma transação no banco de dados
  const order = await prisma.order.create({
    data: {
      userId: Number(userId),
      status: 'paid',
      total: Number(total.toFixed(2)),
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}