const User = require("../models/User");

// Métodos para adicionar, editar e apagar um técnico estão no controller de user.

module.exports = class TecnicoController {
  // Lista todos
  static async showAll(req, res) {

    try {
      
      const tecnicosData = await User.findAll({
        raw: true,
      });

      const tecnicos = tecnicosData.map((tecnico)=>({
        ...tecnico,
        createdAt: new Date(tecnico.createdAt).toLocaleString('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year:'numeric',
            hour: '2-digit',
            minute:'2-digit'
        }),
        updatedAt: new Date(tecnico.updatedAt).toLocaleString('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year:'numeric',
            hour: '2-digit',
            minute:'2-digit'
        })
      }))

      let administrador = req.session.user ? req.session.user.nivel === 'administrador' : false

      res.render("tecnico/tecnicos", { tecnicos, administrador });
    } catch (err) {
      req.flash('message','Ocorreu um erro, tente outra vez mais tarde.')
      console.log("O erro é: ", err);
      return
    }
  }
};
