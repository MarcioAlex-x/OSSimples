const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const fs = require('fs')
const path = require('path')
require('dotenv').config()


// modulos internos
const conn = require(`./db/conn`);

// models
const User = require('./models/User')
const Cliente = require('./models/Cliente')
const Servico = require('./models/Servico')
const Ordem = require('./models/Ordem')
const FormaPagamento = require('./models/FormaPagamento')
const Venda = require('./models/Venda')
const VendaProduto = require('./models/VendaProduto')
const Produto = require('./models/Produto')
const OrdemServico = require('./models/OrdemServico')
const relations = require('./models/relations')
const infoAssistencia = require('./models/InfoAss')

// rotas
const authRouter = require('./routes/authRouter');
const dashboardRouter = require('./routes/dashboardRouter')
const clienteRouter = require('./routes/clienteRouter')
const tecnicoRouter = require('./routes/tecnicoRouter')
const ordemRouter = require('./routes/ordemRouter')
const servicoRouter = require('./routes/servicoRouter')
const produtoRouter = require('./routes/produtoRouter')
const vendaRouter = require('./routes/vendaRouter')
const relatoriosRouter = require('./routes/relatoriosRouter')
const infosRouter = require('./routes/infosRouter')

// controllers
const AuthController = require("./controllers/AuthController");
const DasboardController = require("./controllers/DashboardController");

// iniciação do app
const app = express();

// configuração do handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(__dirname, 'session'),
      ttl: 60*60*24,
      retries: 1,
      clearExpired: true,
      checkPeriod: 60*60*1000
    }),
    cookie: {
      secure: false,
      maxAge: 60*60*24*1000,
      httpOnly: true,
    },
  })
);

app.use(express.static("public"));
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session;
  }
  next();
});
app.use(flash());

// rotas do sistema
app.use('/auth', authRouter)
app.use('/dashboard' , dashboardRouter )
app.use('/cliente', clienteRouter)
app.use('/tecnico', tecnicoRouter)
app.use('/ordem',ordemRouter)
app.use('/servico', servicoRouter)
app.use('/produto', produtoRouter)
app.use('/venda', vendaRouter)
app.use('/relatorios', relatoriosRouter)
app.use('/infos',infosRouter)
app.get('/', DasboardController.showDashboard)

// Relacionamentos
require('./models/relations')

// servidor
conn
  // .sync({force:true})
  // .sync({ alter:true })
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
