const { Op } = require("sequelize");
const Cliente = require("../models/Cliente");
const Ordem = require("../models/Ordem");
const User = require("../models/User");

module.exports = class ClienteController {
  // mostrar todos os clientes
  static async showAll(req, res) {
    let message = false;
    let contentMessage = "";
    let classe = "";

    let order = "DESC";
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    try {
      let clientesVazio = false;

      const clientes = await Cliente.findAll({
        where: {
          nome: { [Op.like]: `%${search}%` },
        },
        order: [["createdAt", order]],
        include: [
          {
            model: Ordem,
            attributes: ["id"],
          },
        ],
      });

      if (clientes.length === 0) {
        clientesVazio = true;
      }

      const clientesComOrdem = clientes.map((cliente) => {
        return {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          qtdOrdens: cliente.Ordems ? cliente.Ordems.length : 0,
        };
      });

      // console.log(clientesComOrdem)

      res.render("cliente/clientes", {
        clientes: clientesComOrdem,
        clientesVazio,
        search,
      });
    } catch (err) {
      return res.redirect("dashboard/painel");
    }
  }

  // página de clientes
  static clienteCreate(req, res) {
    res.render("cliente/create");
  }

  // adicionar um novo cliente
  static async addCliente(req, res) {
    let message = false;
    let contentMessage = "";
    let classe = "";

    const { nome, email, telefone, endereco } = req.body;

    if (!nome || !email || !telefone || !endereco) {
      return res.render("/cliente/create", {
        message: true,
        contentMessage: "Todos os campos precisam ser preenchidos.",
        classe: "erro",
      });
    }

    try {
      const newCliente = {
        nome,
        email,
        telefone,
        endereco,
      };

      await Cliente.create(newCliente);
      return res.redirect("/cliente/clientes");
    } catch (err) {
      return res.render("/cliente/create", {
        message: true,
        contentMessage: "Algo deu errado, tente outra vez em instantes.",
        classe: "erro",
      });
    }
  }

  // mostrar cliente pelo id
  static async showOne(req, res) {
    const id = req.params.id;
    try {
      const cliente = await Cliente.findOne({
        where: { id },
        raw: true,
        include: [Ordem],
      });

      const dataCriacao = new Date(cliente.createdAt);
      const dataAtualizacao = new Date(cliente.updatedAt);
      const dataCriacaoFormatada = dataCriacao.toLocaleString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const dataAtualizacaoForamatada = dataAtualizacao.toLocaleString(
        "pt-BR",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      return res.render("cliente/cliente", {
        cliente,
        dataAtualizacaoForamatada,
        dataCriacaoFormatada,
      });
    } catch (err) {
      req.flash("message", "Erro ao tentar acessar a página no cliente.");
      return res.render("/cliente/clientes");
    }
  }
  // página de atualizar usuario
  static async updateForm(req, res) {
    const id = req.params.id;
    try {
      const cliente = await Cliente.findOne({
        where: { id },
        raw: true,
      });

      if (!cliente) {
        req.flash("message", "Usuário não encontrado.");
        return res.render("cliente/cliente");
      }
      res.render("cliente/atualizar", { cliente });
    } catch (err) {
      req.flash(
        "message",
        "Ocorreu um erro inesperado, favor tentar novamente mais tarde."
      );
      return res.render("cliente/cliente");
    }
  }

  // atualizar cliente
  static async updateCliente(req, res) {
    const { id, nome, email, telefone, endereco } = req.body;
    try {
      const clienteAtualizado = {
        id,
        nome,
        email,
        telefone,
        endereco,
      };
      await Cliente.update(clienteAtualizado, { where: { id } });
      req.flash("message", "Cliente atualizado com sucesso.");
      return res.redirect(`/cliente/cliente/${id}`);
    } catch (err) {
      req.flash(
        "message",
        "Ocorreu um erro inesperado, favor tentar novamente mais tarde."
      );
      return res.render("/cliente/cliente");
    }
  }
  // apagar um usuario
  static async deleteCliente(req, res) {
    const id = req.body.id;
    try {
      await Cliente.destroy({ where: { id } });
      req.flash("message", "Cliente excluído com sucesso.");
      return res.redirect("/cliente/clientes");
    } catch (err) {
      console.error("O erro foi", err);
      req.flash("message", "Não foi possível deletar o cliente.");
      return res.render("/cliente/clientes");
    }
  }
};
