const Ordem = require("../models/Ordem");
const Cliente = require("../models/Cliente");
const User = require("../models/User");
const Servico = require("../models/Servico");
const OrdemServico = require("../models/OrdemServico");
const { Op } = require("sequelize");

module.exports = class OrdemController {
  static async showAll(req, res) {

    let byStatus = ''
    let complemento = ''

    if(req.query.byStatus){
        byStatus = req.query.byStatus
    }

    if(req.query.byStatus === 'aberto'){
        complemento = 'abertas'
    }else if(req.query.byStatus === 'concluido'){
        complemento = 'concluídas'
    }else if(req.query.byStatus === 'entregue'){
        complemento = 'entregues'
    }

    const ordensData = await Ordem.findAll({
        where:{
            status:{ [Op.like]:`%${byStatus}%` }
        },
      order: [["id", "DESC"]],
      include: [
        { model: Cliente, attributes: ["nome"] },
        { model: User, attributes: ["nome"] },
      ],
    });

    const ordens = ordensData.map((ordem) => ({
      id: ordem.id,
      cliente: ordem.Cliente ? ordem.Cliente.nome : "Desconhecido",
      tecnico: ordem.User ? ordem.User.nome : "Desconhecido",
      dataentrada: ordem.dataentrada.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      prazoentrega: ordem.prazoentrega.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      checklist: ordem.checklist,
      precoTotal: ordem.precoTotal,
      formapagamento: ordem.formapagamento,
      status: ordem.status,
    }));

    let semOrdens = ordens.length === 0;

    res.render("ordem/ordens", { ordens, semOrdens, complemento });
  }

  static async addOrdem(req, res) {
    const clientes = await Cliente.findAll({ raw: true });
    const tecnicos = await User.findAll({ raw: true });
    const servicos = await Servico.findAll({ raw: true });

    res.render("ordem/create", { clientes, tecnicos, servicos });
  }

  static async newOrdem(req, res) {
    try {
      const {
        ClienteId,
        UserId,
        dataentrada,
        prazoentrega,
        checklist,
        desconto,
        formapagamento,
        status,
        servicos,
      } = req.body;

      if (!servicos || servicos.length === 0) {
        req.flash("message", "Selecione pelo menos um serviço.");
        return res.redirect("/ordem/create");
      }

      const servicosSelecionados = await Servico.findAll({
        where: { id: servicos },
      });

      let precoTotal = servicosSelecionados.reduce(
        (total, servico) => total + parseFloat(servico.preco),
        0
      );

      precoTotal -= parseFloat(desconto || 0);

      const ordem = await Ordem.create({
        ClienteId: parseInt(ClienteId),
        UserId: parseInt(UserId),
        dataentrada,
        prazoentrega,
        checklist,
        precoTotal,
        desconto,
        formapagamento,
        status,
      });

      await ordem.addServicos(servicosSelecionados);

      return res.redirect("/ordem/ordens");
    } catch (err) {
      console.error(err);
      
      return res.redirect("/ordem/create");
    }
  }
  static async ChangeStatus(req, res) {
    let message = false
    let contentMessage = ''
    let classe = ''
    try {
        
      const { id, status } = req.body;

      await Ordem.update({ status }, { where: { id } });

      if(status === ''){
        req.flash('message','Você precisa informar o status.')
        return res.redirect('/ordem/ordens')
      }

      console.log('Deu certo')
      
      return res.redirect('/ordem/ordens',{
        message : true,
        contentMessage : 'Você precisa informar o status.',
        classe : 'erro'
      })
    } catch (err) {
        console.log('Deu errado')
        
        return res.redirect('/ordem/ordens')
    }
  }
};
