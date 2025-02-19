const express = require('express')
const ClienteController = require('../controllers/ClienteController')
const authMiddlewares = require('../helpers/authMiddlewares')
const router = express.Router()

router.get('/create', authMiddlewares.hasValidSession, ClienteController.clienteCreate )
router.get('/clientes', authMiddlewares.hasValidSession, ClienteController.showAll)
router.get('/cliente/:id',authMiddlewares.hasValidSession, ClienteController.showOne)
router.get('/atualizar/:id', authMiddlewares.hasValidSession, ClienteController.updateForm)

router.post('/addCliente', authMiddlewares.hasValidSession, ClienteController.addCliente)
router.post('/updateCliente', authMiddlewares.hasValidSession, ClienteController.updateCliente)
router.post('/deleteCliente', authMiddlewares.hasValidSession, ClienteController.deleteCliente)

module.exports = router
