# Título

F001 - Cadastrar Projeto

# Descrição

Permitir que o usuário se cadastre no sistema para realizar um pedido.

# Fluxo Principal

- O usuário abre a tela de login.
- O usuário insere o nome e o CPF.
- Sistema salva as informações do usuário no banco de dados.

# Regras de negócio

- O cpf precisa ser validado através de um schema que valida o cpf com a biblioteca ```cpf-cnpj-validator```
- Não pode existir outro usuário com o mesmo cpf.
- O sistema precisa verificar se o usuário já existe no banco de dados, caso sim, o login é efetivado, e caso não, o usuário é criado e
o login é efetivado.
- O sistema retorna um jwt que possui a role "user".

# Fluxo de excessão

- Retorna 409 caso já exista um usuário cadastrado com o cpf informado.
- Caso o nome seja "admin" e o cpf seja "00000000000", o sistema retorna um jwt que possui a role "admin".

# Interface HTTP

```POST /usuarios```

# Schemas

## UserCreateRequestDto

- nome (String, min 3, max 50, not blank)
- cpf (String, validado pela biblioteca)

## UserCreateResponseDto

- nome
- cpf