const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const authMiddlewares = require('../helpers/authMiddlewares')

// rotas para login
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.post('/logout',authMiddlewares.hasValidSession , AuthController.logout)
router.post('/delete/:id' ,authMiddlewares.hasValidSession ,AuthController.userDelete)

// rotas para register
router.get('/register', AuthController.register)
router.post('/register',authMiddlewares.verifyCredentials, AuthController.registerPost)
router.get('/edit/:id',authMiddlewares.hasValidSession, AuthController.userEdit)
router.post('/edit',authMiddlewares.hasValidSession, AuthController.userEditPost)
router.get('/recuperar-senha',AuthController.RecuperarSenha)//Pausado até assinar API de envio de email

module.exports = router
