const mysql = require('mysql');
require('dotenv').config();

const conexao = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USE,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DATABASE',
];

required.forEach((chave) => {
  if (!process.env[chave] === undefined) {
    throw new Error(`Variável ausente: ${chave}`);
  }
});

module.exports = conexao;
