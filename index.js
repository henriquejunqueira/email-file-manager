require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const appCustom = require('./config/appCustom');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

appCustom(app);

const port = process.env.PORT || 3000;

app.listen(port, (error) => {
  if (error) {
    console.log('Deu erro...');
    return;
  }

  console.log(`Rodando em http://localhost:${port}`);
});
