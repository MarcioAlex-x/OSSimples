const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const OrdemServico = db.define('OrdemServico',{
    quantidade:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

module.exports = OrdemServico
