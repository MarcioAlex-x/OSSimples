const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Produto = db.define('Produto',{
    nome:{
        type: DataTypes.STRING,
        allowNull:false
    },
    precoCompra:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    precoVenda:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    quantidade:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario:{
        type:DataTypes.STRING,
        allowNull:false
    },
})

module.exports = Produto
