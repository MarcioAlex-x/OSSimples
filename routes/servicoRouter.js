const express = require('express')
const ServicoController = require('../controllers/ServicoController')
const authMiddlewares = require('../helpers/authMiddlewares')
const router = express.Router()

router.get('/servicos', authMiddlewares.hasValidSession, ServicoController.showAll)
router.get('/create', authMiddlewares.hasValidSession, ServicoController.createServico)
router.get('/edit/:id', authMiddlewares.hasValidSession, ServicoController.updateForm)

router.post('/addServico', authMiddlewares.hasValidSession, ServicoController.addServico)
router.post('/updateServico', authMiddlewares.hasValidSession, ServicoController.updateServico)
router.post('/delete/:id', authMiddlewares.hasValidSession, ServicoController.deleteServico)

module.exports = router
