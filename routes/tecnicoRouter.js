const express = require('express')
const ClienteController = require('../controllers/ClienteController')
const AuthController = require('../controllers/AuthController')
const TecnicoController = require('../controllers/TecnicoController')
const authMiddlewares = require('../helpers/authMiddlewares')
const router= express.Router()

router.get('/tecnicos', authMiddlewares.hasValidSession, TecnicoController.showAll)

module.exports = router
