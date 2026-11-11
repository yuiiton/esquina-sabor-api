# Título

F007 - Efetivar Pedido

# Descrição

Permitir que o usuário realize o pedido.

# Fluxo Principal

- Usuário loga como cliente.
- Usuário seleciona os produtos que quer adicionar ao carrinho.
- O usuário aperta em comprar.
- O sistema recebe da tela um lista de IDs de produtos e suas quantidades.
- O sistema valida cada ID e armazena o pedido do usuário com o status de "pagamento efetuado".

# Regras de negócio

- O sistema valida que todos os IDs representam produtos existentes no banco de dados.

# Fluxo de excessão

- Caso algum produto não seja identificado, o sistema cancela a operação e retorna 400.

# Interface HTTP

```POST pedidos/```

# Schemas

## ProductsIdsDto

- id (int, not null)
- quantity (int, not null)

## PedidoRequestDto

- List[ProductsIdsDto]