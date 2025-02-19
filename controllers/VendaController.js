const Venda = require('../models/Venda');
const Produto = require('../models/Produto');
const VendaProduto = require('../models/VendaProduto');
const Tecnico = require('../models/User')

module.exports = class VendaController {
    // Página para criar uma nova venda
    static async create(req, res) {
        try {
            const produtos = await Produto.findAll(); 
            const vendedores = await Tecnico.findAll();
            return res.render('venda/create', { produtos, vendedores });
        } catch (error) {
            console.error('Erro ao carregar página de venda:', error);
            return res.status(500).send('Erro ao carregar página');
        }
    }

    // Salvar uma nova venda no banco de dados
    static async addVenda(req, res) {
        const { comprador, formapagamento, vendedor, produtos, quantidades } = req.body;

        try {
            if (!Array.isArray(produtos) || !Array.isArray(quantidades)) {
                return res.status(400).send('Erro nos dados enviados');
            }

            let precoTotal = 0;

            // Criar a venda
            const venda = await Venda.create({
                comprador,
                formapagamento,
                vendedor,
                precoTotal: 0 // Atualizado depois
            });

            // Adicionar os produtos à venda
            for (let i = 0; i < produtos.length; i++) {
                const produto = await Produto.findByPk(produtos[i]);
                if (!produto) continue;

                const quantidade = parseInt(quantidades[i], 10);
                const precoUnitario = parseFloat(produto.precoVenda);

                precoTotal += precoUnitario * quantidade;

                await VendaProduto.create({
                    VendaId: venda.id,
                    ProdutoId: produto.id,
                    quantidade,
                    precoUnitario
                });
            }

            // Atualizar o preço total da venda
            await venda.update({ precoTotal });

            return res.redirect('/venda/lista');
        } catch (error) {
            console.error('Erro ao registrar venda:', error);
            return res.status(500).send('Erro ao registrar venda');
        }
    }
};
