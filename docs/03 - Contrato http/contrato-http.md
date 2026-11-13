# Contrato HTTP da API Esquina Sabor

## 1. Visão geral

- Base URL: `/api/v1`
- Formato de resposta: JSON
- Autenticação: JWT em header `Authorization: Bearer <token>`
- Quando a operação tiver sucesso, a resposta segue este formato:

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso."
}
```

- Quando ocorrer erro, o formato esperado é:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mensagem detalhada do erro."
  }
}
```

## 2. Convenções de autenticação

### Header obrigatório

```http
Authorization: Bearer <jwt>
```

### Payload do JWT

O token gerado pelo sistema inclui:

```json
{
  "sub": 1,
  "name": "Maria Silva",
  "cpf": "12345678909",
  "role": "user"
}
```

### Regras implementadas

- O login cria o usuário automaticamente quando ele não existe.
- O CPF funciona como identificador principal da conta.
- O login com `name = "admin"` e `cpf = "00000000000"` gera a role `admin`.
- Para rotas protegidas, o backend usa `req.user` preenchido pelo middleware de autenticação.
- O `userId` do pedido é obtido do JWT e não deve ser enviado no body da requisição.

## 3. Códigos de erro esperados

| Código                    | Status | Quando ocorre                                 |
| -------------------------- | ------ | --------------------------------------------- |
| `VALIDATION_ERROR`       | 400    | Payload inválido ou campos fora da regra     |
| `UNAUTHORIZED`           | 401    | Token ausente, inválido ou sem autorização |
| `INVALID_TOKEN`          | 401    | JWT inválido ou expirado                     |
| `INVALID_CREDENTIALS`    | 401    | Nome/CPF inconsistentes                       |
| `PRODUCT_NOT_FOUND`      | 404    | Produto não encontrado                       |
| `PRODUCT_ALREADY_EXISTS` | 409    | Nome duplicado de produto                     |
| `PRODUCT_UNAVAILABLE`    | 409    | Produto indisponível para compra             |
| `INTERNAL_SERVER_ERROR`  | 500    | Erro interno inesperado                       |

## 4. Usuários

### F001 - Login e cadastro de usuário

#### Endpoint

```http
POST /api/v1/auth/login
```

#### Headers

```http
Content-Type: application/json
```

#### Request body

```json
{
  "name": "Maria Silva",
  "cpf": "12345678909"
}
```

#### Regras

- `name`: obrigatório, entre 3 e 50 caracteres
- `cpf`: obrigatório, CPF válido
- Se o usuário não existir, ele é criado automaticamente
- Se o CPF do usuário já existir, o nome deve bater com o cadastro existente
- Caso o login seja feito com `admin` e `00000000000`, a role é `admin`

#### Resposta de sucesso - 200 OK

```json
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

#### Exemplo de erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CPF inválido."
  }
}
```

## 5. Produtos

### F002 - Cadastrar produto

#### Endpoint

```http
POST /api/v1/products
```

#### Headers

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

#### Regras

- Requer autenticação
- Requer role `admin`
- `name`: obrigatório, 3 a 50 caracteres
- `description`: opcional, 3 a 150 caracteres
- `price`: obrigatório, maior que zero
- `imageUrl`: obrigatório, URL válida
- `available`: obrigatório, booleano
- Não pode existir outro produto com o mesmo nome

#### Request body

```json
{
  "name": "X-Burger",
  "description": "Hambúrguer artesanal com queijo",
  "price": 29.9,
  "imageUrl": "https://example.com/x-burger.png",
  "available": true
}
```

#### Resposta de sucesso - 201 Created

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

### F003 - Atualizar produto

#### Endpoint

```http
PATCH /api/v1/products/:id
```

#### Headers

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

#### Regras

- Requer autenticação
- Requer role `admin`
- O produto deve existir
- Os campos enviados seguem as mesmas validações do cadastro
- O `available` deve ser booleano quando informado

#### Request body

```json
{
  "name": "X-Burger Deluxe",
  "description": "Hambúrguer artesanal com queijo e bacon",
  "price": 34.9,
  "imageUrl": "https://example.com/x-burger-deluxe.png",
  "available": true
}
```

#### Resposta de sucesso - 200 OK

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

### F004 - Listar produtos

#### Endpoint

```http
GET /api/v1/products?page=1&limit=10
```

#### Regras

- Não exige autenticação
- Retorna apenas produtos com `available = true`
- Suporta paginação por `page` e `limit`
- Ordenação atual implementada: por nome ascendente

#### Resposta de sucesso - 200 OK

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

### F005 - Consultar detalhes do produto

#### Endpoint

```http
GET /api/v1/products/:id
```

#### Regras

- Não exige autenticação
- O produto deve existir
- A API retorna o produto mesmo que seja `available = false` quando o identificador existe

#### Resposta de sucesso - 200 OK

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

### F006 - Apagar produto

#### Endpoint

```http
DELETE /api/v1/products/:id
```

#### Headers

```http
Authorization: Bearer <jwt>
```

#### Regras

- Requer autenticação
- Requer role `admin`
- Produto deve existir
- Exclusão do tipo hard delete

#### Resposta de sucesso - 200 OK

```json
{
  "success": true,
  "message": "Produto removido com sucesso."
}
```

## 6. Pedidos

### F007 - Efetivar pedido

#### Endpoint

```http
POST /api/v1/orders
```

#### Headers

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

#### Regras

- Requer autenticação
- O `userId` NÃO deve ser enviado no body
- O usuário autenticado é identificado pelo JWT
- O pedido deve conter pelo menos um item
- Cada item deve ter:
  - `productId`: número inteiro positivo
  - `quantity`: inteiro positivo
- Todos os produtos precisam existir
- Todos os produtos precisam estar com `available = true`
- O total é calculado no backend com base no preço do banco
- O status salvo do pedido é `paid`

#### Request body

```json
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

#### Resposta de sucesso - 201 Created

```json
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

## 7. Resumo dos endpoints

| Método | Endpoint                 | Autenticação | Descrição                  |
| ------- | ------------------------ | -------------- | ---------------------------- |
| POST    | `/api/v1/auth/login`   | Não           | Login/cadastro do usuário   |
| POST    | `/api/v1/products`     | Sim, admin     | Criar produto                |
| PATCH   | `/api/v1/products/:id` | Sim, admin     | Atualizar produto            |
| GET     | `/api/v1/products`     | Não           | Listar produtos disponíveis |
| GET     | `/api/v1/products/:id` | Não           | Consultar produto            |
| DELETE  | `/api/v1/products/:id` | Sim, admin     | Excluir produto              |
| POST    | `/api/v1/orders`       | Sim            | Efetivar pedido              |
