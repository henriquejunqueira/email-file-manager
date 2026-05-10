class Tabelas {
  init(conexao) {}

  criarTabelaPublicacoes() {
    const sql = `
        create table if not exists publicacoes(
            id int not null auto_increment primary key,
            cityName varchar(100),
            organType enum("PM", "CM") default "PM",
            content varchar(255),
            quantity int,
            date datetime not null default current_timestamp
        )`;

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
