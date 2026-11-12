import { z } from 'zod';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export const loginSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, 'O nome deve ter entre 3 e 50 caracteres.')
    .max(50, 'O nome deve ter entre 3 e 50 caracteres.'),
  cpf: z
    .string({ required_error: 'O CPF é obrigatório.' })
    .refine((val) => {
      // Permite o CPF do admin independentemente da regra matemática
      if (val === '00000000000') return true;
      return cpfValidator.isValid(val);
    }, {
      message: 'CPF inválido.',
    }),
});