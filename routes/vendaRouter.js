const express = require('express');
const VendaController = require('../controllers/VendaController');
const router = express.Router();

router.get('/create', VendaController.create); // Página para criar uma venda
router.post('/add', VendaController.addVenda); // Criar venda

module.exports = router;
