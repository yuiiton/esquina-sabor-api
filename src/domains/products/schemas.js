import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .trim()
    .min(3, 'O nome deve ter entre 3 e 50 caracteres.')
    .max(50, 'O nome deve ter entre 3 e 50 caracteres.'),
  description: z
    .string()
    .trim()
    .min(3, 'A descrição deve ter no mínimo 3 caracteres.')
    .max(150, 'A descrição deve ter no máximo 150 caracteres.')
    .optional()
    .nullable(),
  price: z
    .number({ required_error: 'O preço é obrigatório.' })
    .positive('O preço deve ser maior que zero.'),
  imageUrl: z
    .string({ required_error: 'A URL da imagem é obrigatória.' })
    .trim()
    .url('A imagem deve ser enviada em URL válida.'),
  available: z.boolean({ required_error: 'O campo available é obrigatório.' }),
});

export const productUpdateSchema = productCreateSchema.partial();