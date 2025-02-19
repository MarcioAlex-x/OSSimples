const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Venda = db.define('Venda',{
   
    precoTotal:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    formapagamento:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    vendedor:{
        type:DataTypes.STRING,
        allowNull:false
    },
    comprador:{
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Venda
