const { DataTypes } = require('sequelize')

const db = require('../db/conn')

module.exports = db.define('info',{
    assistencia:{
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco:{
        type: DataTypes.STRING,
        allowNull: true
    },
    cidade:{
        type: DataTypes.STRING,
        allowNull:true
    },
    estado:{
        type: DataTypes.STRING,
        allowNull:true
    },
    complemento:{
        type: DataTypes.STRING,
        allowNull:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull: true
    },
    whatsapp:{
        type: DataTypes.STRING,
        allowNull: false
    },
    responsavel:{
        type: DataTypes.STRING,
        allowNull:true
    }
})
