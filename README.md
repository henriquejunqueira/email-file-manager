# Email File Manager

### Sistema de CRUD para gerenciamento de e-mails de publicações do Jornal Panorama

#### Criação do arquivo package.json:

- Primeiramente é necessário gerar o arquivo package.json para guardar configurações gerais do projeto. Como dependências, configuração de script, etc

```bash
npm init -y
```

#### Instalação de dependências nodejs:

- Cada dependência instalada tem seu propósito no sistema:
- cors:
  - É um pacote de segurança essencial para que o Frontend consiga conversar com o Backend.
  - Por padrão, navegadores bloqueiam requisições de um site (ex: localhost:3000) para uma API em outro endereço (ex: localhost:5000).
  - O cors libera esse acesso de forma controlada.
  - Sem ele, o fetch(api, ...) daria um erro de segurança no console do navegador e os dados nunca seriam enviados.
- dotenv:
  - O dotenv serve para gerenciar variáveis de ambiente através de um arquivo chamado .env
- express:
  - O Express é o framework principal.
  - Com ele, é possível gerenciar as rotas, tratar requisições HTTP e enviar respostas para o frontend.
- MySQL:
  - Driver de conexão que permite ao Node.js "falar" com o banco de dados MySQL.

```bash
npm i cors dotenv express mysql
```

#### Instalação de dependências de desenvolvedor nodejs:

- Essa dependência não é necessária caso não vá utilizar o projeto em modo de devenvolvimento

```bash
npm i --save-dev nodemon
```

#### Estrutura do sistema:

```
/email-file-manager
├── config
    └── appCustom.js
├── controllers
    └── publicacaoController.js
├── db
    ├── conexao.js
    └── tabelas.js
├── models
    └── publicacaoModel.js
├── public
    ├── index.html
    ├── script.js
    └── style.css
├── routers
    ├── index.js
    └── publicacaoRouter.js
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

#### Baixando e instalando o projeto

```bash
git clone https://github.com/henriquejunqueira/email-file-manager.git
cd email-file-manager
npm install
```

#### Configurações

- Para rodar o projeto, é necessário criar o arquivo .env com as variáveis:
  - DB_HOST
  - DB_PORT
  - DB_USER
  - DB_PASSWORD (vazio se não tiver senha no seu mysql)
  - DB_DATABASE
  - PORT

- Obs: na raiz do projeto existe um arquivo .env.example que indica a configuração de variáveis

#### Rodando o sistema

- Rodando em modo de desenvolvimento (necessário o nodemon, pois está especificado no package.json):

```bash
npm run dev
```

- Rodando em modo de produção (apenas utilização)

```bash
npm start
```
