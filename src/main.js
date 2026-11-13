import express from 'express';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import usersRouter from './domains/users/router.js';
import productsRouter from './domains/products/router.js';
import ordersRouter from './domains/orders/router.js';

const app = express();
const PORT = process.env.PORT || 3000;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const dataDir = path.join(currentDir, 'data');

mkdirSync(dataDir, { recursive: true });

try {
  execSync('npx prisma db push --schema=src/prisma/schema.prisma', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
  });
} catch (error) {
  console.error('Falha ao sincronizar o banco de dados com o Prisma:', error.message);
  process.exit(1);
}

app.use(express.json());

// Rotas da API v1
app.use('/api/v1', usersRouter);
app.use('/api/v1', productsRouter);
app.use('/api/v1', ordersRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocorreu um erro interno no servidor.',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});