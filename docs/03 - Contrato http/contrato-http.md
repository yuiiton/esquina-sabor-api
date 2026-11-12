# Padrão geral

- Base URL: ``/api/v1``
- Resposta padrão:

```
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

- Erro:

```
{
  "success": false,
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "Já existe um usuário cadastrado com este CPF."
  }
}
```

# Usuário

## F001 - Login e cadastro de usuário

### Endpoint

```
POST /api/v1/auth/login
```

### Request

```
{
  "name": "Maria Silva",
  "cpf": "12345678909"
}
```

### Response - 200

```
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Maria Silva",
      "cpf": "12345678909",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login realizado com sucesso."
}
```

### Regras de autenticação

- Quando o usuário não existe, o sistema cria automaticamente o registro com `role = "user"`.
- Quando o usuário existe, o sistema valida se o CPF informado corresponde ao CPF salvo.
- Quando `name = "admin"` e `cpf = "00000000000"`, o sistema autentica como `role = "admin"`.
- O JWT deve conter no payload: `sub`, `name`, `cpf` e `role`.
- As rotas protegidas devem receber o token no header `Authorization: Bearer <token>`.

# Produtos

## F002 - Cadastrar produto

### Endpoint

```
POST /api/v1/products
```

### Request

```
{
  "name": "X-Burger",
  "description": "Hambúrguer artesanal com queijo",
  "price": 29.90,
  "imageUrl": "https://example.com/x-burger.png",
  "available": true
}
```

### Response - 201

```
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

## F003 - Atualizar produto

### Endpoint

```
PATCH /api/v1/products/:id
```

### Request

```
{
  "name": "X-Burger Deluxe",
  "description": "Hambúrguer artesanal com queijo e bacon",
  "price": 34.90,
  "imageUrl": "https://example.com/x-burger-deluxe.png",
  "available": true
}
```

### Response - 200

```
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

## F004 - Listar produtos

### Endpoint

```
GET /api/v1/products?page=1&limit=10
```

### Response - 200

```
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

## F005 - Consultar detalhes do produto

### Endpoint

```
GET /api/v1/products/:id
```

### Response - 200

```
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

## F006 - Apagar produto

### Endpoint

```
DELETE /api/v1/products/:id
```

### Response - 200

```
{
  "success": true,
  "message": "Produto removido com sucesso."
}
```

# Pedido

## Regras de autenticação para pedidos

- O `userId` não deve vir no body da requisição.
- O usuário autenticado deve ser identificado a partir do JWT do token.
- O backend deve extrair o identificador do usuário do payload do token (`sub`) e utilizá-lo como referência do pedido.
- Qualquer rota que cria ou altera um pedido deve exigir o header `Authorization: Bearer <token>`.

## F007 - Efetivar pedido

### Endpoint

```
POST /api/v1/orders
```

### Request

```
{
  "items": [
    {
      "productId": 10,
      "quantity": 2
    },
    {
      "productId": 7,
      "quantity": 1
    }
  ]
}
```

### Response - 201

```
{
  "success": true,
  "data": {
    "id": 99,
    "userId": 1,
    "status": "paid",
    "createdAt": "2026-11-11T18:30:00.000Z",
    "total": 84.8,
    "items": [
      {
        "productId": 10,
        "quantity": 2,
        "unitPrice": 29.9
      },
      {
        "productId": 7,
        "quantity": 1,
        "unitPrice": 24.9
      }
    ]
  },
  "message": "Pedido realizado com sucesso."
}
```

## F007 - Efetivar pedido

### Endpoint

```
POST /api/v1/orders
```

### Request

```
{
  "items": [
    {
      "productId": 10,
      "quantity": 2
    },
    {
      "productId": 7,
      "quantity": 1
    }
  ]
}
```

### Response - 201

```
{
  "success": true,
  "data": {
    "id": 99,
    "userId": 1,
    "status": "paid",
    "createdAt": "2026-11-11T18:30:00.000Z",
    "total": 84.8,
    "items": [
      {
        "productId": 10,
        "quantity": 2,
        "unitPrice": 29.9
      },
      {
        "productId": 7,
        "quantity": 1,
        "unitPrice": 24.9
      }
    ]
  },
  "message": "Pedido realizado com sucesso."
}
```
