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

    try {
      const user = await User.findOne({ where: { nome } });
      if (!user) {
        req.flash("message", "Usuário não encontrado.");
        return res.render("auth/login");
      }
      const decodesPassword = await bcrypt.compare(password, user.password);

      if (!decodesPassword) {
        req.flash("message", "Senha inválida");
        return res.render("auth/login");
      }

      req.session.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        especialidade: user.especialidade,
      };

      return req.session.save(() => {
        req.flash("message", "Logado com sucesso");
        res.redirect("/dashboard/painel");
      });
    } catch (err) {
      console.log(err);
      req.flash("message", "Ocorreu um erro inesperado.");
      return res.status(500).render("auth/login");
    }
  }

  // metodos para register
  static async register(req, res) {
    return res.render("auth/register");
  }

  // novo usuário
  static async registerPost(req, res) {
    const { nome, email, password, telefone, endereco, especialidade, nivel } =
      req.body;
    const newUser = async () => {
      // Validação decampos
      if (!nome || !email || !password || !telefone || !endereco) {
        req.flash("message", "Todos os dados precisam ser informados.");
        return res.status(400).render("auth/register");
      }

      // criptografar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const existingEmail = await User.findOne({ where: { email } });
      const existingName = await User.findOne({ where: { nome } });

      if (existingEmail) {
        req.flash("message", "O email informado já está sendo usado.");
        return res.status(400).render("auth/register");
      }

      if (existingName) {
        req.flash(
          "message",
          "O nome de usuário informado já está sendo usado."
        );
        return res.status(400).render("auth/register");
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
        req.flash(
          "message",
          "Aconteceu um erro inesperado, por favor tentar novamente."
        );
        return res.render("auth/register");
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
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    // console.log("nome", user.nome);
    if (!user) {
      req.flash("message", "Usuário não encontrado.");
      return res.render("auth/edit");
    }

    const userData = user.get({ plain: true });
    return res.render("auth/edit", { user: userData });
  }

  // editar um usuário
  static async userEditPost(req, res) {
    const id = req.body.id;
    const { nome, email, password, telefone, endereco, especialidade, nivel } =
      req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      req.flash("message", "Usuário não encontrado.");
      return res.render("auth/edit");
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
      req.flash(
        "message",
        "Ocorreu um erro inesperado, por favor tente outra vez."
      );
      return res.status(500).render("auth/edit");
    }
  }

  // apagar usuário
  static async userDelete(req, res) {
    const id = req.params.id;
    try {
      await User.destroy({
        where: { id },
      });
      req.flash("message", "Usuário deletado.");
      return res.redirect("/tecnico/tecnicos");
    } catch (err) {
      return;
    }
  }
  //Recuperar senha - Pausado até assinar API de envio de e-mail
  static async RecuperarSenha(req, res) {
    try {
      res.render('/auth/recuperar-senha')
    } catch (err) {
      req.flash('message','Ocorreu um erro, tente outra vez.')
      res.render('auth/login')
    }
  }
};
