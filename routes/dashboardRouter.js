const express = require('express')
const authMiddlewares = require('../helpers/authMiddlewares')
const DasboardController = require('../controllers/DashboardController')
const router = express.Router()

router.get('/painel',authMiddlewares.hasValidSession, DasboardController.showDashboard)

module.exports = router
