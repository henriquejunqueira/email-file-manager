# Email File Manager

### Sistema de CRUD para gerenciamento de e-mails de publicações do Jornal Panorama

# Criação do arquivo package.json:

```bash
npm init -y
```

# Instalação de dependências nodejs:

```bash
npm i cors dotenv express mysql
```

# Instalação de dependências de desenvolvedor nodejs:

```bash
npm i --save-dev nodemon
```

# Estrutura do sistema:

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
