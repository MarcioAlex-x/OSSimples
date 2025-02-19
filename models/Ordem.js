const { DataTypes } = require('sequelize')

const OrdemServico = require('./OrdemServico')
const Servico = require('./Servico')

const db = require('../db/conn')

const Ordem = db.define('Ordem',{
    
    dataentrada:{
        type: DataTypes.DATE,
        allowNull:false
    },
    prazoentrega:{
        type:DataTypes.DATE,
        allowNull:false
    },
    checklist:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    precoTotal:{
        type:DataTypes.STRING(10,2),
        allowNull:false,
        defaultValue: 0.00
    },
    desconto:{
        type: DataTypes.STRING,
        allowNull:false
    },
    formapagamento:{
        type: DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        defaultValue: 'aberto'
    }
})


module.exports = Ordem
