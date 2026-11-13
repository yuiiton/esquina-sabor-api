# Título

F002 - Cadastrar Produtos

# Descrição

Permitir que um administrador cadastre novos produtos disponíveis para venda.

# Fluxo principal

- O usuário autenticado acessa a funcionalidade de cadastro de produto.
- O usuário informa nome, descrição, preço, imagem e disponibilidade.
- O sistema valida os dados.
- O sistema salva o produto no banco de dados.

# Regras de negócio

- O usuário deve estar autenticado e possuir role `admin`.
- O nome do produto deve ter entre 3 e 50 caracteres.
- O preço deve ser maior que zero.
- A imagem deve ser enviada em URL válida.
- Não pode existir outro produto com o mesmo nome.
- O campo `available` deve ser booleano.

# Fluxo de exceção

- Retorna `401 Unauthorized` quando o usuário não for administrador.
- Retorna `409 Conflict` quando já existir um produto com o mesmo nome.
- Retorna `400 Bad Request` quando o payload for inválido.

# Interface HTTP

```http
POST /api/v1/products
```

# Request

```json
{
  "name": "X-Burger",
  "description": "Hambúrguer artesanal com queijo",
  "price": 29.9,
  "imageUrl": "https://example.com/x-burger.png",
  "available": true
}
```

# Response

## 201 Created

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
  },
  "message": "Produto cadastrado com sucesso."
}
```

# Schemas

## ProductCreateRequest

- name: string, obrigatório, 3 a 50 caracteres
- description: string, opcional, 3 a 150 caracteres
- price: number, obrigatório, maior que zero
- imageUrl: string, obrigatório
- available: boolean, obrigatório
