const express = require('express')
const router = express.Router()
const RelatoriosController = require('../controllers/RelatoriosController')
const authMiddlewares = require('../helpers/authMiddlewares')

router.get('/relatorios', authMiddlewares.hasValidSession, RelatoriosController.showRelatorios)

module.exports = router
