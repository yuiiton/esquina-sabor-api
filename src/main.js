import express from 'express';
import usersRouter from './domains/users/router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas da API v1
app.use('/api/v1', usersRouter);

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