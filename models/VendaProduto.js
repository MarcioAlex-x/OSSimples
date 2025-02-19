const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const Produto = require('./Produto');
const Venda = require('./Venda');

const VendaProduto = db.define('VendaProduto', {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, { timestamps: false });

VendaProduto.belongsTo(Venda)
VendaProduto.belongsTo(Produto)

module.exports = VendaProduto;
