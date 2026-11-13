# Título

F003 - Atualizar Produtos

# Descrição

Permitir que um administrador atualize os dados de um produto já cadastrado.

# Fluxo principal

- O usuário autenticado acessa a funcionalidade de edição do produto.
- O administrador informa os campos que deseja alterar.
- O sistema valida os novos dados.
- O sistema salva a atualização no banco de dados.

# Regras de negócio

- O usuário deve estar autenticado e possuir role `admin`.
- O produto deve existir antes da atualização.
- Os campos alterados devem respeitar as mesmas validações do cadastro.
- Caso `available` seja enviado, ele deve ser booleano.

# Fluxo de exceção

- Retorna `401 Unauthorized` quando o usuário não for administrador.
- Retorna `404 Not Found` quando o produto não existir.
- Retorna `400 Bad Request` quando algum campo for inválido.

# Interface HTTP

```http
PATCH /api/v1/products/:id
```

# Request

```json
{
  "name": "X-Burger Deluxe",
  "description": "Hambúrguer artesanal com queijo e bacon",
  "price": 34.9,
  "imageUrl": "https://example.com/x-burger-deluxe.png",
  "available": true
}
```

# Response

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "X-Burger Deluxe",
    "description": "Hambúrguer artesanal com queijo e bacon",
    "price": 34.9,
    "imageUrl": "https://example.com/x-burger-deluxe.png",
    "available": true
  },
  "message": "Produto atualizado com sucesso."
}
```
