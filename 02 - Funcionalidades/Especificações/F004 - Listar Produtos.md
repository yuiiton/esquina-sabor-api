# Título

F004 - Listar Produtos

# Descrição

Permitir listar os produtos cadastrados no banco de dados com paginação.

# Fluxo Principal

- O usuário abre a pagina inicial do site e os produtos aparecem.
- O usuário pode navegar entre os produtos através das setas de navegação da interface.

# Regras de negócio

- Não é necessário que o usuário esteja logado para listar os produtos.
- Somente os produtos com o campo ```available == true```.


# Interface HTTP

```Get /produtos?page={page}&per_page={per_page}```

# Schemas

## ProductResponse

- nome
- descricao
- preco
- imagemUrl

## ProductListResponseDto

- List[ProductResponse]