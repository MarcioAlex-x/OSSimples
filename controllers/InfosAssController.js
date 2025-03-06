const InfoAss = require('../models/InfoAss')
const fs = require('fs')
const path = require('path')

module.exports = class InfosAssController{
    static async create(req,res){
        const infosCadastradas = await InfoAss.findAll()
        if( infosCadastradas.length === 0){
            res.render('infos/create')
        }else{
            res.redirect('/infos/showInfos')
        }
    }

    static async showInfos(req,res){
        const infosCadastradas = await InfoAss.findAll({raw: true})
        
        res.render('infos/showInfos', {infosCadastradas})
    }

    static async addInfos(req,res){
        const {assistencia, endereco,cidade, estado, complemento, email, whatsapp, responsavel } = req.body
        try{
            const infos = {
                assistencia,
                endereco,
                cidade,
                estado,
                complemento,
                email,
                whatsapp,
                responsavel,
            }
            await InfoAss.create(infos)

            return res.redirect('/infos/create')
        }catch(err){
            console.log(err)
        }
    }
}
