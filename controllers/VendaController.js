const Venda = require('../models/Venda');
const Produto = require('../models/Produto');
const VendaProduto = require('../models/VendaProduto');
const Tecnico = require('../models/User')

module.exports = class VendaController {
    // Página para criar uma nova venda
    static async create(req, res) {
        try {
            const produtosData = await Produto.findAll(); 
            const vendedoresData = await Tecnico.findAll();

            const produtos = produtosData.map(result=>({
                nome:result.nome,
                preco:result.precoVenda
            }))

            const vendedores = vendedoresData.map(result=>({
                nome:result.nome
            }))
            
            console.log(vendedores)
            return res.render('venda/create', { produtos, vendedores });
        } catch (error) {
            console.error('Erro ao carregar página de venda:', error);
            return res.status(500).send('Erro ao carregar página');
        }
    }
};
