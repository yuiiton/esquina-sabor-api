# Título

F003 - Atualizar Produtos

# Descrição

Permitir atualizar as informações de um produto já cadastrado no banco de dados.

# Fluxo Principal

- O usuário loga como administrador.
- O usuário seleciona o produto que deseja modificar.
- O usuário envia os campos que deseja modificar.
- O sistema valida os novos campos e salva no banco de dados.

# Regras de negócio

- A role do jwt do usuário precisa ser igual a "admin".
- O produto precisa existir no banco de dados.

# Fluxo de excessão

- Retorna 401 caso o usuário não seja um admin.
- Retorna 404 caso o produto não seja encontrado.

# Interface HTTP

```PATCH produtos/{id}```

# Schemas

## ProductUpdateRequestDto

- nome (String opcional, min 3, max 50, not blank)
- descricao (String opcional, min 3, max 150)
- preco (Number opcional, not null) (obs: O usu do tipo Number é apenas para simplifação de escopo, não sendo indicado para variáveis que devem armazenar valores de dinheiro).
- imagemUrl (String opcional, not blank).
- disponivel (Boolean opcional).

## ProductUpdateResponseDto

- nome
- descricao
- preco
- imagemUrl
- disponivel