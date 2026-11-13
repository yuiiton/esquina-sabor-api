import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.number({ required_error: 'O ID do produto é obrigatório.' }).int().positive(),
  quantity: z.number({ required_error: 'A quantidade é obrigatória.' }).int().positive('A quantidade deve ser maior que zero.'),
});

export const orderCreateSchema = z.object({
  items: z
    .array(orderItemSchema, { required_error: 'Os itens do pedido são obrigatórios.' })
    .min(1, 'O pedido deve conter pelo menos um item.'),
});