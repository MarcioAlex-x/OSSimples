const express = require('express')
const authMiddlewares = require('../helpers/authMiddlewares')
const InfosAssController = require('../controllers/InfosAssController')

const router = express.Router()

router.get('/create',authMiddlewares.hasValidSession, InfosAssController.create)
router.get('/showInfos', authMiddlewares.hasValidSession, InfosAssController.showInfos)
router.post('/addInfos', authMiddlewares.hasValidSession, InfosAssController.addInfos)

module.exports = router
