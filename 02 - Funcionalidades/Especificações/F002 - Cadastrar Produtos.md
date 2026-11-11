# Título

F002 - Cadastrar Produtos

# Descrição

Permitir que o administrador cadastre produtos no banco de dados.

# Fluxo Principal

- O usuário loga como administrador.
- O usuário aperta num botão de cadastrar produto na tela principal.
- O usuário insere nome, descrição, preço e url da imagem.
- O sistema cadastra o produto no banco de dados.

# Regras de negócio

- A role do jwt do usuário precisa ser igual a "admin".
- O sistema precisa verificar se existe um produto cadastrado com o mesmo nome.

# Fluxo de excessão

- Retorna 401 caso o usuário não seja um admin.
- Retorna 409 caso haja um produto cadastrado com o nome inserido.

# Interface HTTP

```POST /produtos```

# Schemas

## ProductCreateRequestDto

- nome (String, min 3, max 50, not blank)
- descricao (String opcional, min 3, max 150)
- preco (Number, not null) (obs: O usu do tipo Number é apenas para simplifação de escopo, não sendo indicado para variáveis que devem armazenar valores de dinheiro).
- imagemUrl (String, not blank).

## ProductCreateResponseDto

- nome
- descricao
- preco
- imagemUrl
- disponivel