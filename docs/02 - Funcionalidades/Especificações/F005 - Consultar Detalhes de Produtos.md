# Título

F005 - Consultar Detalhes de Produtos

# Descrição

Permitir que o cliente visualize os detalhes completos de um produto específico.

# Fluxo principal

- O usuário acessa a listagem de produtos.
- O usuário seleciona um item para ver mais detalhes.
- A API retorna as informações do produto informado.

# Regras de negócio

- Não é necessário autenticação para consultar detalhes do produto.
- O produto deve existir no banco de dados.
- A API deve retornar o produto mesmo se ele estiver indisponível? A regra da aplicação pode ser definida conforme o contexto de negócio; normalmente, apenas `available = true` deve aparecer para compra, mas detalhes podem ser exibidos para controle interno.

# Fluxo de exceção

- Retorna `404 Not Found` quando o produto não existir.

# Interface HTTP

```http
GET /api/v1/products/:id
```

# Response

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "X-Burger",
    "description": "Hambúrguer artesanal com queijo",
    "price": 29.9,
    "imageUrl": "https://example.com/x-burger.png",
    "available": true
  }
}
```
