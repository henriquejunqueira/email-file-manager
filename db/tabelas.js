class Tabelas {
  init(conexao) {}

  criarTabelaPublicacoes() {
    const sql = `
        CREATE TABLE IF NOT EXISTS publicacoes (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          cityName VARCHAR(100) NOT NULL,
          -- Usamos VARCHAR(20) para suportar "PM", "CM" e "Agencia" sem erros de truncamento
          organType VARCHAR(20) DEFAULT "PM",
          content VARCHAR(255) NOT NULL,
          quantity INT NOT NULL,
          -- DATETIME armazena data e hora. O default é o momento do insert.
          date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;

    this.conexao.query(sql, (error) => {
      if (error) {
        console.log('Erro ao tentar crir tabela publicações...');
        console.log(error.message);
        return;
      }
    });

    console.log('Tabela publicações criada com sucesso...');
  }
}

module.exports = new Tabelas();
