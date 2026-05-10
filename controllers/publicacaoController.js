const publicacoesModel = require('../models/publicacaoModel');

class PublicacaoController {
  buscarPublicacoes(req, res) {
    publicacoesModel
      .listarPublicacoes()
      .then((publicacoes) => res.status(200).json(publicacoes))
      .catch((error) => res.status(400).json(error.message));
  }

  criarPublicacoe(req, res) {
    publicacoesModel
      .cadastrarPublicacoes(req.body)
      .then((publicacaoCriada) => res.status(201).json(publicacaoCriada))
      .catch((error) => {
        console.log(error);
        res.status(400).json(error.message);
      });
  }

  atualizarPublicacao(req, res) {
    const { id } = req.params;

    publicacoesModel
      .atualizarPublicacoes(req.body, id)
      .then((resultado) => res.status(200).json(resultado))
      .catch((error) => res.status(400).json(error.message));
  }

  deletarPublicacao(req, res) {
    const { id } = req.params;

    publicacoesModel
      .deletarPublicacoes(id)
      .then((resultado) => res.status(200).json(resultado))
      .catch((error) => res.status(400).json(error.message));
  }
}

module.exports = new PublicacaoController();
