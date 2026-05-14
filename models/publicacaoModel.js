const conexao = require('../db/conexao');

class PublicacaoModel {
  executaQuery(sql, parametros = '') {
    return new Promise((resolve, reject) => {
      conexao.query(sql, parametros, (error, resposta) => {
        if (error) {
          console.log(error);
          return reject(error);
        }

        resolve(resposta);
      });
    });
  }

  listarPublicacoes() {
    const sql = `SELECT * FROM publicacoes ORDER BY date ASC, id ASC`;

    return this.executaQuery(sql);
  }

  cadastrarPublicacoes(novaPublicacao) {
    const dados = {
      cityName: novaPublicacao.cityName,
      organType: novaPublicacao.organType,
      content: novaPublicacao.content,
      quantity: novaPublicacao.quantity,
      date: novaPublicacao.date,
    };

    console.log(dados);

    const sql = 'INSERT INTO publicacoes SET ?';
    return this.executaQuery(sql, dados);
  }

  atualizarPublicacoes(publicacaoAtualizada, id) {
    const dados = {
      cityName: publicacaoAtualizada.cityName,
      organType: publicacaoAtualizada.organType,
      content: publicacaoAtualizada.content,
      quantity: publicacaoAtualizada.quantity,
    };

    const sql = 'UPDATE publicacoes SET ? WHERE id = ?';
    return this.executaQuery(sql, [dados, id]);
  }

  deletarPublicacoes(id) {
    const sql = 'DELETE FROM publicacoes WHERE id = ?';
    return this.executaQuery(sql, id);
  }
}

module.exports = new PublicacaoModel();
