const Servico = require("../models/Servico");
module.exports = class ServicoController {
  static async showAll(req, res) {
    const servicoData = await Servico.findAll({
      raw: true,
    });
    const servicos = servicoData.map((serv) => ({
      ...serv,
      precoFormatado: parseFloat(serv.preco).toFixed(2).replace(".", ","),
    }));
    res.render("servico/servicos", { servicos });
  }

  static createServico(req, res) {
    res.render("servico/create");
  }

  static async addServico(req, res) {
    const { nome, preco, descricao } = req.body;
    const servico = {
      nome,
      preco,
      descricao,
    };

    if (!nome || !preco || !descricao) {
      req.flash("message", "Todos os campos precisam ser preechidos.");
      return res.redirect("/servico/addServico");
    }
    try {
      await Servico.create(servico);
      req.flash("message", "Serviço criado com sucesso.");
      return res.redirect("/servico/servicos");
    } catch (err) {
      req.flash(
        "message",
        "Ocorreu um erro inesperado, tente outra vez mais tarde."
      );
      return res.redirect("/servico/addServico");
    }
  }

  static async updateForm(req, res) {
    const id = req.params.id;
    const servico = await Servico.findOne({
      where: { id },
      raw: true,
    });

    res.render("servico/edit", { servico });
  }

  static async updateServico(req, res) {

    const { id, nome, preco, descricao } = req.body;
    try {
      const servicoAtualizado = {
        nome,
        preco,
        descricao,
      };
      await Servico.update(servicoAtualizado, { where: { id } });
      req.flash("message", "Serviço atualizado com sucesso.");
      res.redirect("/servico/servicos");
    } catch (err) {
      console.log(err)
      req.flash(
        "message",
        "Ocorreu um erro inesperado, tente outra vez mais tarde."
      );
      res.redirect("/servico/servicos");
    }
  }

  static async deleteServico(req, res){
    const id = req.params.id
    try{
      await Servico.destroy({ where: { id } })
      req.flash('message','Srviço apagado com sucesso.')
      return res.redirect('/servico/servicos')
    }catch(err){
      req.flash('message','Ocorreu um erro inesperado, tente outra vez mais tarde.')
      return res.redirect('/servico/servicos')
    }
  }
};
