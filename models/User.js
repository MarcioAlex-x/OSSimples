const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = db.define('User',{
    nome:{
        type:DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    telefone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco:{
        type: DataTypes.STRING,
        allowNull:false
    },
    especialidade:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue: 'Técnico'
    },
    nivel:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: 'colaborador'
    }
})

module.exports = User
