const { DataTypes } = require('sequelize')

const db = require('../db/conn')

module.exports = db.define('FormaPagamento',{
    forma:{
        type: DataTypes.STRING,
        allowNull:false
    }
})
