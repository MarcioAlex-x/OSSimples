const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Servico = db.define('Servico',{
    nome:{
        type:DataTypes.STRING,
        allowNull:false
    },
    preco:{
        type:DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    descricao:{
        type:DataTypes.TEXT,
        allowNull:false
    }
})

module.exports = Servico
