# Título

F006 - Apagar Produtos

# Descrição

Permitir que um administrador remova um produto do sistema.

# Fluxo principal

- O usuário autenticado acessa a funcionalidade de exclusão.
- O administrador seleciona um produto.
- O sistema valida a existência do produto.
- O sistema remove o registro do banco de dados.

# Regras de negócio

- O usuário deve estar autenticado e possuir role `admin`.
- O produto deve existir antes da exclusão.
- A exclusão será do tipo hard delete, removendo o registro do banco de dados.

# Fluxo de exceção

- Retorna `401 Unauthorized` quando o usuário não for administrador.
- Retorna `404 Not Found` quando o produto não existir.

# Interface HTTP

```http
DELETE /api/v1/products/:id
```

# Response

## 200 OK

```json
{
  "success": true,
  "message": "Produto removido com sucesso."
}
```
