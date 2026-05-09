const router = require('../routers/publicacaoRouter');
const conexao = require('../db/conexao');
const tabelas = require('../db/tabelas');

module.exports = (app, express) => {
  app.use(router);
  tabelas.init(conexao);
};
