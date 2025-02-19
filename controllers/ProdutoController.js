const Produto = require("../models/Produto");

module.exports = class ProdutoController {
  static async showAll(req, res) {
    const produtos = await Produto.findAll({
      raw: true,
    });
    let semProdutos = produtos.length === 0
    return res.render("produto/produtos", { produtos, semProdutos });
  }

  static async create(req, res) {
    return res.render("produto/create");
  }

  static async addProduto(req, res) {
    let message = false;
    let contentMessage = "";
    let classe = "";

    const { nome, precoCompra, precoVenda, quantidade } = req.body;

    try {
      const newProduto = {
        nome,
        precoCompra: parseFloat(precoCompra),
        precoVenda: parseFloat(precoVenda),
        quantidade,
        usuario: req.session.user.nome,
      };

      await Produto.create(newProduto);

      res.render("produto/create", {
        message: true,
        contentMessage:
          "Produto adicionado com sucesso. Siga adicionando ou consulte os produtos acessando o estoque.",
        classe: "sucesso",
      });
    } catch (err) {
      res.render("produto/create", {
        message: true,
        contentMessage: `Não foi possível adicionar um novo produto.`,
        classe: "erro",
      });
    }
  }

  static async produto(req, res) {
    const id = req.params.id;

    let adm = false
    if(req.session.user.nivel === 'administrador'){
      adm = true
    }

    const produto = await Produto.findOne({
      where: { id },
      raw: true,
    });

    const dataCriacao = new Date(produto.createdAt).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const precoCompra = parseFloat(produto.precoCompra)
      .toFixed(2)
      .replace(".", ",");
    const precoVenda = parseFloat(produto.precoVenda)
      .toFixed(2)
      .replace(".", ",");

    res.render("produto/produto", {
      produto,
      dataCriacao,
      precoCompra,
      precoVenda,
      adm
    });
  }

  static async updateFrom(req, res) {  

    const id = req.params.id;
    const produto = await Produto.findOne({
      where: { id },
      raw: true,
    });

    return res.render("produto/atualizar", { produto });
  }

  static async updateProduto(req, res) {
    let message = false
    let contentMessage = ''
    let classe = ''

    try {
      const { id, nome, precoCompra, precoVenda, quantidade } = req.body;

      const produto = {
        nome,
        precoCompra,
        precoVenda,
        quantidade,
      };

      await Produto.update(produto, {
        where: { id },
      });
      return res.redirect("/produto/produtos");
    } catch (err) {
      return res.render('/produto/updateForm',{
        message: true,
        contentMessage: 'Ocorreu um erro inesperado. Favor tente outra vez mais tarde.',
        classe: 'erro'
      })
    }
  }

  static async deleteProduto(req, res) {
    console.log(req.body)
    const{ id } = req.body
    try{
      await Produto.destroy({
        where: { id }
      })
    }catch(err){
      console.log(err)
    }
    return res.redirect('/produto/produtos')
  }
};
