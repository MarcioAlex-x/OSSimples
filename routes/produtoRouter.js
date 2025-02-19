const express = require('express')
const ProdutoController = require('../controllers/ProdutoController')
const router = express.Router()

router.get('/produtos', ProdutoController.showAll)
router.get('/create', ProdutoController.create)
router.get('/produto/:id', ProdutoController.produto)
router.get('/atualizar/:id', ProdutoController.updateFrom)

router.post('/addproduto', ProdutoController.addProduto)
router.post('/updateProduto', ProdutoController.updateProduto)
router.post('/delete',ProdutoController.deleteProduto)

module.exports = router
