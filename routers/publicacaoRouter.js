const { Router } = require('express');
const router = Router();

const publicacaoController = require('../controllers/publicacaoController');

router.get('/publicacoes', publicacaoController.buscarPublicacoes);

router.post('/publicacoes', publicacaoController.criarPublicacao);

router.put('/publicacoes/:id', publicacaoController.atualizarPublicacao);

router.delete('/publicacoes/:id', publicacaoController.deletarPublicacao);

module.exports = router;
