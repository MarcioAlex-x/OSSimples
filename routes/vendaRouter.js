const express = require('express');
const VendaController = require('../controllers/VendaController');
const router = express.Router();

router.get('/create', VendaController.create);

module.exports = router;
