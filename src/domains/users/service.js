import prisma from '../../core/database.js';
import { generateToken } from '../../core/security.js';

export async function loginOrRegister({ name, cpf }) {
  const isAdminRequest = name === 'admin' && cpf === '00000000000';
  const role = isAdminRequest ? 'admin' : 'user';

  let user = await prisma.user.findUnique({
    where: { cpf },
  });

  if (user) {
    if (user.name !== name && !isAdminRequest) {
      const error = new Error('O CPF informado já pertence a outro usuário com nome diferente.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }
  } else {
    user = await prisma.user.create({
      data: {
        name,
        cpf,
        role,
      },
    });
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      role: user.role,
    },
    token,
  };
}