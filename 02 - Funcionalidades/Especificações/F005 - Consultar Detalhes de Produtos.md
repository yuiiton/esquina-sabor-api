# Título

F005 - Consultar Detalhes de Produtos

# Descrição

Permitir consultar as informações específicas de um produto.

# Fluxo Principal

- Usuário clica no botão de visualizar detalhes na interface.
- As informações são exibidas na tela.

# Regras de negócio

- Não é necessário que o usuário esteja logado para consultar os detalhes do produto.
- O sistema verifica se existe algum produto com o id informado.

# Fluxo de excessão

- Retorna 404 caso não exista um produto com o id informado.

# Interface HTTP

```GET produtos/{id}```

# Schemas

## ProductResponse

- nome
- descricao
- preco
- imagemUrl