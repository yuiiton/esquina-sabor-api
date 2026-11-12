# Título

F007 - Efetivar Pedido

# Descrição

Permitir que um usuário autenticado finalize uma compra com uma lista de produtos.

# Fluxo principal

- O frontend gerencia o carrinho localmente.
- O usuário autenticado seleciona os produtos e as quantidades no frontend.
- Quando confirma a compra, o frontend monta o payload do pedido já pronto.
- O backend recebe esse payload final junto com o token do usuário autenticado.
- O backend extrai o usuário do JWT e usa esse identificador para associar o pedido.
- O backend valida cada item do pedido.
- O backend calcula o total do pedido e cria o registro do pedido com status `paid`.

# Regras de negócio

- O usuário deve estar autenticado.
- O `userId` não deve ser enviado no body da requisição.
- O carrinho não é persistido no backend.
- O pedido deve conter pelo menos um item.
- Cada item deve possuir um `productId` válido.
- A quantidade de cada item deve ser maior que zero.
- Todos os produtos devem existir e estar disponíveis para compra.
- O total do pedido deve ser calculado com base no preço unitário e na quantidade.
- O status do pedido será salvo como `paid` para este fluxo.

# Fluxo de exceção

- Retorna `400 Bad Request` quando o payload for inválido.
- Retorna `404 Not Found` quando um produto ou usuário não existir.
- Retorna `409 Conflict` quando a operação violar uma regra de negócio.

# Interface HTTP

```http
POST /api/v1/orders
```

# Request

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

# Response

## 201 Created

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

# Schemas

## OrderItemRequest

- productId: number, obrigatório
- quantity: number, obrigatório, maior que zero

## OrderCreateRequest

- items: OrderItemRequest[], obrigatório
- O `userId` é obtido do JWT do usuário autenticado e não deve ser enviado no body.

## OrderResponse

- id: number
- userId: number
- status: string
- createdAt: string
- total: number
- items: OrderItemResponse[]

## OrderItemResponse

- productId: number
- quantity: number
- unitPrice: number
