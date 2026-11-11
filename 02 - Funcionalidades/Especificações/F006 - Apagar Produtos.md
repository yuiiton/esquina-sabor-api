# Título

F006 - Apagar Produtos

# Descrição

Permitr apagar produtos do banco de dados. (Obs: hard delete)

# Fluxo Principal

- O usuário loga como administrador.
- O administrador seleciona o produto através da interface e apaga ele.

# Regras de negócio

- A role do jwt do usuário precisa ser igual a "admin".
- O sistema verifica se existe algum produto com o id informado.

# Fluxo de excessão

- Retorna 401 caso o usuário não seja admin.
- Retorna 404 caso não exista um produto com o id informado.

# Interface HTTP

```POST produtos/apagar/{id}```