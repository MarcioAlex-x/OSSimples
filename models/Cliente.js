const { DataTypes, Sequelize, HasMany } = require('sequelize')

const db = require('../db/conn')

const Cliente = db.define('Cliente',{
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    telefone:{
        type: DataTypes.STRING,
        allowNull:false
    },
    endereco:{
        type:DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Cliente
