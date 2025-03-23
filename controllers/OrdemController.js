const Ordem = require("../models/Ordem");
const Cliente = require("../models/Cliente");
const User = require("../models/User");
const Servico = require("../models/Servico");
const Info = require('../models/InfoAss')
const { sendWhatsAppMessage } = require("../services/whatsappService");
const { Op } = require("sequelize");

module.exports = class OrdemController {
  static async showAll(req, res) {
    let byStatus = "";
    let complemento = "";

    if (req.query.byStatus) {
      byStatus = req.query.byStatus;
    }

    if (req.query.byStatus === "aberto") {
      complemento = "abertas";
    } else if (req.query.byStatus === "concluido") {
      complemento = "concluídas";
    } else if (req.query.byStatus === "entregue") {
      complemento = "entregues";
    }

    const ordensData = await Ordem.findAll({
      where: {
        status: { [Op.like]: `%${byStatus}%` },
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

    const abertas = ordensData.filter( ordem => ordem.status === 'aberto' )
    const concluidas = ordensData.filter( ordem => ordem.status === 'concluido')
    const entregues = ordensData.filter( ordem => ordem.status === 'entregue')

    res.render("ordem/ordens", { ordens, complemento, abertas, concluidas, entregues });
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
        marca,
        modelo,
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
  
      const cliente = await Cliente.findByPk(ClienteId);
      if (!cliente)
        return res.status(404).json({ error: "Cliente não encontrado." });
  
      const atendente = await User.findByPk(UserId)

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
        marca,
        modelo,
        checklist,
        precoTotal,
        desconto,
        formapagamento,
        status,
      });
  
      await ordem.addServicos(servicosSelecionados);

      const dataentradaForatada = new Date(ordem.dataentrada).toLocaleString('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      const prazoentregaFormatada = new Date(ordem.prazoentrega).toLocaleString('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
  
      if (cliente.telefone) {

        const assistencia = await Info.findAll()
        const dadosAssistencia = assistencia.map(dados => ({
          nome: dados.assistencia,
          responsavel:dados.responsavel,
          endereco:dados.endereco,
          cidade:dados.cidade,
          estado:dados.estado,
          whatsapp:dados.whatsapp
        }))

        const ass = dadosAssistencia[0]

        const mensagem = `
      *${ass.nome}*
        Localizada em ${ass.endereco}, ${ass.cidade} - ${ass.estado}
        Resposável técinco: ${ass.responsavel}
        whatsapp: ${ass.whatsapp}

      Olá *${cliente.nome}*, sua ordem foi criada com sucesso!
        
        Aqui estão as informações da sua OS de N° ${ordem.id}:
        
      O seu aparelho de marca ${ordem.marca}, modelo ${ordem.modelo} foi recebido em nossa assistência por ${atendente.nome} em ${dataentradaForatada}. Foram registradas as seguintes informações no checklist: 
        ${ordem.checklist}.

      O valor total da sua ordem é de *R$${ordem.precoTotal}*.
      A forma de pagamento é *${ordem.formapagamento}*.
      O prazo de entrega é para o dia *${prazoentregaFormatada}*.

      Você receberá outras mensagens quando o serviço for concluído e finalizado.
        `;
        const { desktopUrl } = sendWhatsAppMessage(
          cliente.telefone,
          mensagem
        );

        return res.send(`
          <script type='text/javascript'>
            var link = document.createElement('a');
            link.href = '${desktopUrl}';
            link.click();

            setTimeout(function() {
              window.location.href = "/ordem/ordens";
            }, 2000);
          </script>
        `);
      } else {
        
        return res.redirect("/ordem/ordens");
      }
    } catch (err) {
      console.error(err);
      req.flash('message','Ocorreu um erro inestperado, tente outra vez em instantes.')
      return res.redirect("/ordem/create");
    }
  }
  
  static async ChangeStatus(req, res) {
    try {
      const { id, status } = req.body;
  
      if (!status) {
        req.flash("message", "Você precisa informar o status.");
        return res.redirect("/ordem/ordens");
      }
  
      // Buscar a ordem e os dados do cliente
      const ordem = await Ordem.findByPk(id, {
        include: [{ model: Cliente, attributes: ["nome", "telefone"] }],
      });
  
      if (!ordem) {
        req.flash("message", "Ordem não encontrada.");
        return res.redirect("/ordem/ordens");
      }
  
      // Atualizar o status da ordem
      await Ordem.update({ status }, { where: { id } });
  
      // Verificar se o cliente tem um telefone cadastrado
      if (ordem.Cliente && ordem.Cliente.telefone) {
        const assistencia = Info.findAll()
        const nomeAssistencia = (await assistencia).map(ass => ass.assistencia)
        let mensagem = `Olá ${ordem.Cliente.nome}, sua ordem de serviço (OS N° ${ordem.id}) teve uma atualização de status.\n\n`;
  
        if (status === "concluido") {
          mensagem += `O serviço foi concluído com sucesso! Sua OS já está pronta para retirada.`;
        } else if (status === "entregue") {
          mensagem += `Seu aparelho já foi entregue. Agradecemos por confiar em nossa assistência!`;
        } else {
          mensagem += `O status da sua OS agora é: ${status}. Caso tenha dúvidas, entre em contato.`;
        }
  
        mensagem += `\n\nAtenciosamente, *${nomeAssistencia}*.`;
  
        const { desktopUrl } = sendWhatsAppMessage(ordem.Cliente.telefone, mensagem);
  
        return res.send(`
          <script type='text/javascript'>
            var link = document.createElement('a');
            link.href = '${desktopUrl}';
            link.click();
  
            setTimeout(function() {
              window.location.href = "/ordem/ordens";
            }, 2000);
          </script>
        `);
      } else {
        return res.redirect("/ordem/ordens");
      }
    } catch (err) {
      req.flash("message", "Ocorreu um erro ao atualizar o status.");
      return res.redirect("/ordem/ordens");
    }
  }
  
  
};
