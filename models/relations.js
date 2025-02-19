const User = require('./User')
const Cliente = require('./Cliente')
const Ordem = require('./Ordem')
const Venda = require('./Venda')
const Produto = require('./Produto')
const VendaProduto = require('./VendaProduto')
const Servico = require('./Servico')
const FormaPagamento = require('./FormaPagamento')
const OrdemServico = require('./OrdemServico')

// cliente / ordem
Cliente.hasMany(Ordem)
Ordem.belongsTo(Cliente)

// usuario / ordem
User.hasMany(Ordem)
Ordem.belongsTo(User)

// venda / cliente
Cliente.hasMany(Venda)
Venda.belongsTo(Cliente)

// venda/usuario
Venda.belongsTo(User)
User.hasMany(Venda)

// n:n entre produtos e venda
Venda.belongsToMany(Produto, { through: VendaProduto })
Produto.belongsToMany(Venda,{ through: VendaProduto })

// n:n entre ordem e serviço
Ordem.belongsToMany(Servico, { through: OrdemServico })
Servico.belongsToMany(Ordem, { through: OrdemServico })
