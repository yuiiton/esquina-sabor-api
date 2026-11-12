# Título

F001 - Login e cadastro de usuário

# Descrição

Permitir que o usuário faça login na aplicação com nome e CPF. Se o usuário não existir, ele será criado automaticamente no banco. Se o nome informado for `admin` e o CPF for `00000000000`, o sistema autentica como administrador.

# Fluxo principal

- O usuário acessa a tela de login do site.
- O usuário informa nome e CPF.
- O sistema verifica se o usuário já existe pelo cpf.
- Se existir, valida se o CPF informado corresponde ao CPF do usuário.
- Se não existir, cria um novo usuário com esse nome e CPF.
- O sistema gera um JWT com a role correspondente.
- O sistema retorna o token para que o cliente use em rotas protegidas.

# Regras de negócio

- A autenticação não usa senha; o CPF funciona como credencial principal do usuário.
- O nome deve ter entre 3 e 50 caracteres.
- O CPF deve ser válido e validado por `cpf-cnpj-validator`.
- Caso o nome informado já exista, o CPF deve bater com o CPF do cadastro existente; caso contrário, a autenticação falha.
- Caso o usuário não exista, ele será criado automaticamente com role `user`.
- Caso o nome informado seja `admin` e o CPF seja `00000000000`, o sistema autentica o usuário como `admin`.
- O usuário admin deve existir no seed do banco SQLite e também pode ser criado automaticamente caso não exista.
- O JWT deve conter pelo menos: `sub`, `name`, `cpf` e `role`.

# Fluxo de exceção

- Retorna `401 Unauthorized` quando o nome não for encontrado ou o CPF não corresponder ao cadastro existente.
- Retorna `400 Bad Request` quando os dados forem inválidos.
- Retorna `409 Conflict` apenas em cenários de inconsistência de dados, se houver regra adicional de duplicidade.

# Interface HTTP

```http
POST /api/v1/auth/login
```

# Request

```json
{
  "name": "Maria Silva",
  "cpf": "12345678909"
}
```

# Response

## 200 OK

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

# Schemas

## LoginRequest

- name: string, obrigatório, 3 a 50 caracteres
- cpf: string, obrigatório, CPF válido

## LoginResponse

- user: object
  - id: number
  - name: string
  - cpf: string
  - role: string
- token: string
