# Título

F004 - Listar Produtos

# Descrição

Permitir que o cliente visualize os produtos disponíveis para compra com paginação.

# Fluxo principal

- O usuário acessa a página inicial da aplicação.
- O sistema consulta os produtos disponíveis.
- O sistema retorna uma página com os itens cadastrados.
- O usuário pode navegar entre páginas.

# Regras de negócio

- Não é necessário autenticação para listar os produtos.
- Somente produtos com `available = true` devem aparecer na listagem.
- A API deve suportar paginação com `page` e `limit`.
- A resposta deve ordenar os produtos por nome ou por ordem de cadastro, conforme regra definida pela aplicação.

# Interface HTTP

```http
GET /api/v1/products?page=1&limit=10
```

# Response

## 200 OK

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "X-Burger",
        "description": "Hambúrguer artesanal com queijo",
        "price": 29.9,
        "imageUrl": "https://example.com/x-burger.png",
        "available": true
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```
