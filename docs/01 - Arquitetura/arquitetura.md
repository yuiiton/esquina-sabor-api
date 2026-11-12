# Contexto

O projeto **Esquina Sabor** é um sistema web idealizado no programa Mais TI da Universidade Federal de Sergipe, com o intuito de consolidar os conhecimentos de desenvolvimento frontend e backend adquiridos na matéria de Desenvolvimento Web. Dessa forma, o esquina-sabor-api é uma API que intermedia as operações do usuário na pagina web com o acesso ao banco de dados da aplicação.

Por estar em um contexto de projeto educacional e com um tempo de implementação limitado, muitas decisões arquiteturais foram tomadas com o intuito de simplificar o escopo do projeto. Portanto, ao ler este documento, tenha em mente que essa API **não tem o intuito de ser um sistema projetado para uso real**.

# O domínio da aplicação

O Esquina Sabor é um restaurante fictício que deseja possuir um sistema web para que os clientes possam realizar pedidos através do navegador. Dessa forma, as principais entidades relacionadas à aplicação foram definidas como:

1. Usuários
2. Produtos
3. Pedidos

## Usuários

Os usuários são as pessoas que acessam a pagina web e realizam login na plataforma.

Para simplificação do escopo, a autenticação do sistema não usa senha. O login é realizado com o nome e o CPF, sendo o CPF utilizado como credencial principal para validar a identidade do usuário. Caso o usuário ainda não exista, o sistema cria automaticamente um novo registro com esse nome e CPF. Se o nome informado for ``admin`` e o CPF for ``00000000000``, o sistema autentica o usuário como administrador e utiliza esse registro previamente criado no seed do banco SQLite.

Um usuário logado possui uma role em jwt que define o seu nível de acesso ao sistema. Sendo essa role ``user`` ou ``admin``.

### Autenticação e JWT

- O endpoint de autenticação receberá o nome e o CPF do usuário.
- O sistema verificará se o usuário existe: se existir, valida se o CPF informado corresponde ao registrado; se não existir, cria o usuário com o nome e CPF informados.
- O JWT será gerado após a validação do usuário e conterá, no payload, ao menos: ``sub`` (id do usuário), ``name``, ``cpf`` e ``role``.
- As rotas protegidas deverão ler o header ``Authorization: Bearer <token>`` e validar o token antes de permitir acesso.
- O middleware de autenticação deverá identificar o usuário e a role do token para autorizar ou bloquear operações.

## Produtos

Os produtos são os itens vendidos no restaurante. Esses produtos são catalogados com informações padronizadas como nome, descrição opcional, preço e imagem do produto.

Para simplificação de escopo, não haverá lógica para controle de estoque no sistema. O controle do estoque será feito através de um atributo que indica a disponibilidade do produto, havendo somente dois status possíveis, ``disponível`` e ``não disponível``.

## Pedidos

Os pedidos são a lista de itens que o usuário deseja comprar. Todo pedido obrigatóriamente precisa estar associado a um usuário e conter uma lista de produtos válidos.

Para simplificação de escopo, não será implementado um método de pagamento real. O pagamento será fictício, apenas mudando o estado do pedido para algo como ``pagamento efetuado``.

### Carrinho no frontend

A aplicação não terá gerenciamento de carrinho no backend. O carrinho será controlado no frontend e, ao final da seleção, o front-end montará o payload do pedido já pronto, com os itens escolhidos e suas quantidades. O backend receberá apenas esse payload final e validará a existência dos produtos, o usuário autenticado e o total do pedido.

Dessa forma, o backend não mantém estado de carrinho nem persistência de itens temporários. O pedido é criado diretamente a partir do payload enviado pelo frontend.

# O banco de dados da aplicação

A aplicação usará um banco de dados SQLite, com o arquivo ``database.sqlite`` armazenado dentro do diretório da API em ``data/``.

## Entidades e seus atributos

1. User -> tabela que armazena os usuários cadastrados na plataforma.

- id -> chave primária criado pelo banco de dados.
- name -> nome do usuário.
- cpf -> cpf do usuário.
- role -> nível de acesso do usuário, podendo ser ``user`` ou ``admin``.

---

2. Product -> tabela que armazena os produtos do restaurante.

- id -> chave primária criado pelo banco de dados.
- name -> nome do produto.
- description -> descrição opcional do produto.
- price -> preço do produto.
- imageUrl -> imagem do produto.
- available -> estado de disponibilidade do produto.

---

3. Order -> tabela que armazena os pedidos dos usuários.

- id -> chave primária criado pelo banco de dados.
- user_id -> identificador que indica a qual usuário o pedido pertence.
- status -> estado do pedido.
- order_date -> data de criação do pedido.
- total -> valor total do pedido.

---

4. OrderItem -> tabela que armazena os itens de um pedido do usuário.

- id -> chave primária criado pelo banco de dados.
- order_id -> identifcador que indica a qual pedido o item pertence.
- product_id -> identificador que indica qual produto pertence a esse item.
- quantity -> quantidade do produto nesse item.
- unit_price -> preço unitário desse item.

# Metodologia

Foi escolhida a metodologia ágil FDD (Feature-Driven Development) devido ao curto tempo hábil para o planejamento e a implementação do sistema. Dessa forma, o sistema será desenvolvido por meio da entrega contínua de pequenas funcionalidades que tenham valor para o cliente, sem a necessidade de criar documentações extensas antes de começar a implementar as funcionalidades.

Dado a escolha da metodologia, serão produzidos inicialmente duas documentações essenciais para o desenvolvimento do sistema:

- Modelo de domínio -> Representa os conceitos do negócio e seus relacionamentos. Esse documento é o conjunto deste arquivo (``architecture.md``) com os diagramas do banco de dados, sendo esse material suficiente para compreender o domínio da aplicação.
- Lista de funcionalidades -> Representa o inventário hierárquico das funcionalidades do sistema. Sendo organizado em **área de domínio**, **atividade de negócio** e **passos da atividade**. Sendo esse material necessário para compreender as funcionalidades que deverão ser implementadas no sistema.

Outros documentos podem ser produzidos conforme as necessidades.

# Stack de desenvolvimento

Foi definido que o projeto fosse desenvolvido utilizando as ferramentas do ecossistema **Node.js**. Dessa forma, a stack escolhida foi:

- Framework -> Express.js
- ORM -> Prisma ORM
- Schemas e validações -> Zod
- Banco de dados -> SQLite local

# Estrutura de diretórios

A API será estruturada seguindo os princípios da organização **Folder By Feature**, da seguinte forma:

```
├── main.js
├── core/
│   ├── database.js
│   └── security.js 
├── prisma/
│   └── schema.prisma
├── domains/
│   ├── users/
│   │   ├── router.js
│   │   ├── service.js
│   │   └── schemas.js
│   ├── products/
│   │   ├── router.js
│   │   ├── service.js
│   │   └── schemas.js
│   └── orders/
│       ├── router.js
│       ├── service.js
│       └── schemas.js
└── data/
    └── database.sqlite
```

## Responsabilidades

### core

Responsável por armazenar os arquivos de configuração da API, como a conexão com o banco de dados e as funções de geração do jwt.

### prisma

Responsável por armazenar os modelos das tabelas do banco de dados.

### domains

Responsável por armazenar os domínios da aplicação.

Cada domínio possui os seguintes arquivos em comum:

- router -> definição das rotas do domínio.
- service -> camada de validação das regras de negócio e de acesso ao banco de dados (não haverá uma camada repository. Decisão feita para simplificação do escopo).
- schemas -> definição dos schemas do domínio, como dados de entrada, saída, etc.

### domains/users

Referente aos usuários da aplicação.

### domains/products

Referente aos produtos do restaurante.

### domains/orders

Referente aos pedidos dos usuários.

### data

Responsável por armazenar o arquivo sqlite.
