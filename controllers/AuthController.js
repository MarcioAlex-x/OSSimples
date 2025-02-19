const { Op } = require("sequelize");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  // metodos para login
  static login(req, res) {
    return res.render("auth/login");
  }

  static async loginPost(req, res) {
    const nome = req.body.nome.trim().toUpperCase();
    const password = req.body.password;

    let message = false
    let contentMessage = ''
    let classe = ''

    try {
      const user = await User.findOne({ where: { nome } });
      if (!user) {
       
        return res.render("auth/login",{  
          message : true,
          contentMessage : 'Usuário não encontrado.',
          classe: 'erro'
         });
      }
      const decodesPassword = await bcrypt.compare(password, user.password);

      if (!decodesPassword) {
        
        return res.render("auth/login",{ 
          message : true,
          contentMessage : 'Senha inválida' ,
          classe: 'erro'
        });
      }

      req.session.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        especialidade: user.especialidade,
      };

      return req.session.save(() => {
        res.redirect("/dashboard/painel");
      });
    } catch (err) {
      req.flash(
        "message",
        ""
      );
      console.log(err);
      return res.status(500).render("auth/login",{ 
        message:true, 
        contentMessage:'Ocorreu um erro inesperado, favor tentar denovo mais tarde.',
        classe: 'erro'
       });
    }
  }

  // metodos para register
  static register(req, res) {
    return res.render("auth/register");
  }

  // novo usuário
  static async registerPost(req, res) {

    let message = false
    let contentMessage = ''
    let classe = ''

    const { nome, email, password, telefone, endereco, especialidade, nivel } =
      req.body;
    const newUser = async () => {
      // Validação decampos
      if (!nome || !email || !password || !telefone || !endereco) {

        return res.status(400).render("auth/register",{
          message: true,
          contentMessage: "Todos os dados precisam ser informados.",
          classe:'erro'
        });
      }

      // criptografar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const existingEmail = await User.findOne({ where: { email } });
      const existingName = await User.findOne({ where: { nome } });

      if (existingEmail) {
        return res.status(400).render("auth/register",{
          message: true,
          contentMessage: "O email informado já está sendo usado.",
          classe:'erro'
        });
      }

      if (existingName) {
        return res.status(400).render("auth/register",{
          message: true,
          contentMessage: 'O nome de usuário informado já está sendo usado.',
          classe:'erro'
        });
      }

      const user = {
        nome: nome.trim().toUpperCase(),
        email: email.trim(),
        password: hashedPassword,
        telefone: telefone.trim(),
        endereco,
        especialidade,
        nivel,
      };
      try {
        const createdUser = await User.create(user);
        return req.session.save(() => {
          res.redirect("/dashboard/painel");
        });
      } catch (err) {
        return res.render("auth/register",{
          message: true,
          contentMessage: "Aconteceu um erro inesperado, por favor tentar novamente.",
          classe: 'erro'
        });
      }
    };
    newUser();
  }
  // sair do sistema
  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  }

  // página para editar um usuário
  static async userEdit(req, res) {

    let message = false
    let contentMessage = ''
    let classe = ''

    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    // console.log("nome", user.nome);
    if (!user) {
      return res.render("auth/edit",{
        message: true,
        contentMessage: "Usuário não encontrado.",
        classe: 'erro'
      });
    }
    const userData = user.get({ plain: true });
    return res.render("auth/edit", { user: userData });
  }

  // editar um usuário
  static async userEditPost(req, res) {

    let message = false
    let contentMessage = ''
    let classe = ''

    const id = req.body.id;
    const { nome, email, password, telefone, endereco, especialidade, nivel } =
      req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.render("auth/edit",{
        message : true,
        contentMessage : 'Usuário não encontrado.',
        classe: 'erro'
      });
    }

    try {
      await user.update({
        nome: nome.trim().toUpperCase(),
        email,
        password,
        telefone,
        endereco,
        especialidade,
        nivel,
      });

      return req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      
      return res.status(500).render("auth/edit",{
        message:true,
        contentMessage:'Ocorreu um erro inesperado, por favor tente outra vez.'
      });
    }
  }

  // apagar usuário
  static async userDelete(req, res) {
    const id = req.params.id;
    try {
      await User.destroy({
        where: { id },
      });
      return res.redirect("/tecnico/tecnicos");
    } catch (err) {
      return;
    }
  }
};
