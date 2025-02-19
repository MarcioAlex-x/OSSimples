const express = require('express')
const OrdemController = require('../controllers/OrdemController')
const authMiddlewares = require('../helpers/authMiddlewares')
const router = express.Router()

router.get('/ordens', authMiddlewares.hasValidSession, OrdemController.showAll)
router.get('/create', authMiddlewares.hasValidSession, OrdemController.addOrdem)

router.post('/newOrdem', authMiddlewares.hasValidSession, OrdemController.newOrdem)
router.post('/changeStatus', authMiddlewares.hasValidSession, OrdemController.ChangeStatus)

module.exports = router
